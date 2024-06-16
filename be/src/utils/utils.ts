import { HttpException, HttpStatus } from "@nestjs/common"
import { Currency } from "./interfaces"
import { Op } from "sequelize"
import sequelize from "sequelize"
import { Sequelize } from "sequelize-typescript"
import { DEFAULT_PAGE_SIZE } from "./constants"
import { Resume } from "src/resume/resume.model"
import { Vacancy } from "src/vacancy/vacancy.model"

export const validatePagesQuery = (query: any) => {
    if (!query.page)
        throw new HttpException(
            "There is no page in query!",
            HttpStatus.BAD_REQUEST
        )

    const page = parseInt(query.page)
    const pageSize = query.pageSize
        ? parseInt(query.pageSize)
        : DEFAULT_PAGE_SIZE

    if (isNaN(page))
        throw new HttpException(
            `Wrong page provided: ${query.page}`,
            HttpStatus.BAD_REQUEST
        )
    if (isNaN(pageSize))
        throw new HttpException(
            `Wrong pageSize provided: ${query.pageSize}`,
            HttpStatus.BAD_REQUEST
        )

    return { page, pageSize }
}

export const paginate = (page: number, pageSize: number) => {
    return {
        offset: (page - 1) * pageSize,
        limit: pageSize,
    }
}

export const getInfoPagination = (
    page: number,
    pageSize: number,
    rowsCount: string | number
) => {
    const count = parseInt(rowsCount as any)
    const pagesTotal = Math.ceil(count / pageSize)

    return {
        info: {
            prevPage: page === 1 ? 1 : page - 1,
            nextPage: page < pagesTotal ? page + 1 : page,
            pagesTotal,
        },
    }
}

const extendWhereConditionWithAnd = (
    whereCondition: any,
    andCondition: any
) => {
    if (!whereCondition || !whereCondition[Op.and]) {
        return {
            ...whereCondition,
            [Op.and]: andCondition,
        }
    }
    if (whereCondition[Op.and]) {
        whereCondition[Op.and] = {
            ...whereCondition[Op.and],
            ...andCondition,
        }
        return whereCondition
    }
    console.log("... Error, unexpected wheeCondition: ...:", whereCondition)
}

export const mapQueryToWhereConditionResume = (query: any) => {
    let whereCondition = mapQueryToWhereCondition(query)
    if (query.includeText) {
        const wordsList = (query.includeText as string)
            .split(" ")
            .map(
                (word) =>
                    "%" +
                    word.replace(
                        /[\.,-\/#!%\^&*;:{}=\-_`~(@\+\?><\[\]+]/g,
                        ""
                    ) +
                    "%"
            )
        const joinedWordList = wordsList.join("', '")
        const condition = {
            [Op.iLike]: {
                [Op.all]: wordsList,
            },
        }
        const andCondition = {
            [Op.or]: [
                { title: condition },
                { description: condition },
                {
                    id: {
                        [Op.in]: Sequelize.literal(
                            `(
                SELECT DISTINCT we."resumeId"
                FROM "workExperiences" we
                WHERE (
                  we."description" ilike all (array['${joinedWordList}'])) OR
                  we."teamInfluence" ilike all (array['${joinedWordList}'])) OR
                  we."myInfluence" ilike all (array['${joinedWordList}']))
                )
              )`
                        ),
                    },
                },
            ],
        }
        whereCondition = extendWhereConditionWithAnd(
            whereCondition,
            andCondition
        )
    }

    if (query.excludeText) {
        const wordsList = (query.excludeText as string)
            .split(" ")
            .map(
                (word) =>
                    "%" +
                    word.replace(
                        /[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g,
                        ""
                    ) +
                    "%"
            )
        const joinedWordList = wordsList.join("', '")
        const condition = {
            [Op.iLike]: {
                [Op.all]: wordsList,
            },
        }

        const andCondition = {
            [Op.not]: {
                [Op.or]: [
                    { title: condition },
                    { description: condition },
                    {
                        id: {
                            [Op.in]: Sequelize.literal(
                                `(
                SELECT DISTINCT we."resumeId"
                FROM "workExperiences" we
                WHERE (
                  we."description" ilike all ((array['${joinedWordList}'])) OR
                  we."teamInfluence" ilike all ((array['${joinedWordList}'])) OR
                  we."myInfluence" ilike all ((array['${joinedWordList}']))
                )
              )`
                            ),
                        },
                    },
                ],
            },
        }

        whereCondition = extendWhereConditionWithAnd(
            whereCondition,
            andCondition
        )
    }

    if (
        query.workExperienceYearsMin &&
        !isNaN(parseInt(query.workExperienceYearsMin)) &&
        query.workExperienceYearsMax &&
        !isNaN(parseInt(query.workExperienceYearsMax))
    ) {
    } else if (
        query.workExperienceYearsMin &&
        !isNaN(parseInt(query.workExperienceYearsMin))
    ) {
    } else if (
        query.workExperienceYearsMax &&
        !isNaN(parseInt(query.workExperienceYearsMax))
    ) {
        const andCondition = [
            {
                id: {
                    [Op.or]: {
                        [Op.in]: Sequelize.literal(
                            `(
                  SELECT we."resumeId"
                  FROM "workExperiences" we
                  GROUP BY we."resumeId"
                  HAVING SUM(((DATE_PART('day', we."endDate" - we."startDate")) / 365.25) <= 
                  ${query.workExperienceYearsMax}
                )`
                        ),
                        [Op.notIn]: Sequelize.literal(
                            `(
                  SELECT we."resumeId"
                  FROM "workExperiences" t
                  GROUP BY we."resumeId"
                )`
                        ),
                    },
                },
            },
        ]
        whereCondition = extendWhereConditionWithAnd(
            whereCondition,
            andCondition
        )
    }

    if (
        query.educationYearsMin &&
        !isNaN(parseInt(query.educationYearsMin)) &&
        query.educationYearsMax &&
        !isNaN(parseInt(query.educationYearsMax))
    ) {
    } else if (
        query.educationYearsMin &&
        !isNaN(parseInt(query.educationYearsMin))
    ) {
    } else if (
        query.educationYearsMax &&
        !isNaN(parseInt(query.educationYearsMax))
    ) {
        const andCondition = [
            {
                id: {
                    [Op.or]: {
                        [Op.in]: Sequelize.literal(
                            `(
                  SELECT e."resumeId"
                  FROM "educations" e
                  GROUP BY e."resumeId"
                  HAVING SUM((DATE_PART('day', e."endsDate" - e."startsDate")) / 365.25) <= 
                  ${query.educationYearsMax}
                )`
                        ),
                        [Op.notIn]: Sequelize.literal(
                            `(
                  SELECT e."resumeId"
                  FROM "educations" e
                  GROUP BY e."resumeId"
                )`
                        ),
                    },
                },
            },
        ]

        whereCondition = extendWhereConditionWithAnd(
            whereCondition,
            andCondition
        )
    }

    return whereCondition
}

export const mapQueryToWhereConditionVacancy = (query: any) => {
    let whereCondition = mapQueryToWhereCondition(query)
    if (query.includeText) {
        const condition = {
            [Op.iLike]: {
                [Op.all]: (query.includeText as string)
                    .split(" ")
                    .map(
                        (word) =>
                            "%" +
                            word.replace(
                                /[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g,
                                ""
                            ) +
                            "%"
                    ),
            },
        }

        const andCondition = {
            [Op.or]: [
                { title: condition },
                { description: condition },
                { requirements: condition },
                { responsibilities: condition },
                { conditions: condition },
            ],
        }

        whereCondition = extendWhereConditionWithAnd(
            whereCondition,
            andCondition
        )
    }

    if (query.excludeText) {
        const condition = {
            [Op.iLike]: {
                [Op.all]: (query.excludeText as string)
                    .split(" ")
                    .map(
                        (word) =>
                            "%" +
                            word.replace(
                                /[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g,
                                ""
                            ) +
                            "%"
                    ),
            },
        }

        const andCondition = {
            [Op.not]: {
                [Op.or]: [
                    { title: condition },
                    { description: condition },
                    { requirements: condition },
                    { responsibilities: condition },
                    { conditions: condition },
                ],
            },
        }

        whereCondition = extendWhereConditionWithAnd(
            whereCondition,
            andCondition
        )
    }

    if (
        query.workExperienceYearsMin &&
        !isNaN(parseInt(query.workExperienceYearsMin))
    )
        whereCondition.workExperienceYearsMax = {
            [Op.gte]: parseInt(query.workExperienceYearsMin),
        }
    if (
        query.workExperienceYearsMax &&
        !isNaN(parseInt(query.workExperienceYearsMax))
    )
        whereCondition.workExperienceYearsMin = {
            [Op.lte]: parseInt(query.workExperienceYearsMax),
        }

    if (query.companyIds && Array.isArray(JSON.parse(query.companyIds)))
        whereCondition.companyId = { [Op.in]: JSON.parse(query.companyIds) }

    if (query.isForStudents)
        whereCondition.isForStudents = query.isForStudents === "true"
    if (query.isForPensioners)
        whereCondition.isForPensioners = query.isForPensioners === "true"
    if (query.isForYoung)
        whereCondition.isForYoung = query.isForYoung === "true"

    if (
        query.disadvantagedGroups &&
        Array.isArray(JSON.parse(query.disadvantagedGroups))
    ) {
        whereCondition.disadvantagedGroups = {
            [Op.contains]: JSON.parse(query.disadvantagedGroups),
        }
    }

    return whereCondition
}

const mapQueryToWhereCondition = (query: any) => {
    const whereCondition: any = { isActive: true, isBanned: false }

    if (query.isRemote) whereCondition.isRemote = query.isRemote === "true"
    if (query.isPartTime)
        whereCondition.isPartTime = query.isPartTime === "true"
    if (query.isAllowedWithDisability)
        whereCondition.isAllowedWithDisability =
            query.isAllowedWithDisability === "true"
    if (query.isFlexibleSchedule)
        whereCondition.isFlexibleSchedule = query.isFlexibleSchedule === "true"
    if (query.isShiftWork)
        whereCondition.isShiftWork = query.isShiftWork === "true"
    if (query.isRatationalWork)
        whereCondition.isRatationalWork = query.isRatationalWork === "true"
    if (query.isDeferredMobilization)
        whereCondition.isDeferredMobilization =
            query.isDeferredMobilization === "true"
    if (query.isTemporary)
        whereCondition.isTemporary = query.isTemporary === "true"
    if (query.isSeasonal)
        whereCondition.isSeasonal = query.isSeasonal === "true"
    if (query.isInternship)
        whereCondition.isInternship = query.isInternship === "true"
    if (query.isVolonteering)
        whereCondition.isVolonteering = query.isVolonteering === "true"
    if (query.isReadyForBusinessTrip)
        whereCondition.isReadyForBusinessTrip =
            query.isReadyForBusinessTrip === "true"

    if (query.salaryMin && !isNaN(parseInt(query.salaryMin)))
        whereCondition.salaryMax = {
            [Op.gte]: parseInt(query.salaryMin),
        }
    if (query.salaryMax && !isNaN(parseInt(query.salaryMax)))
        whereCondition.salaryMin = {
            [Op.lte]: parseInt(query.salaryMax),
        }

    if (
        query.salaryCurrency &&
        Object.values(Currency).includes(query.salaryCurrency) &&
        query.salaryCurrency !== Currency.OTHER
    )
        whereCondition.salaryCurrency = query.salaryCurrency

    if (
        query.teamLeadTempers &&
        Array.isArray(JSON.parse(query.teamLeadTempers))
    )
        whereCondition.teamLeadTemper = {
            [Op.in]: JSON.parse(query.teamLeadTempers),
        }
    if (
        query.teamMethodologies &&
        Array.isArray(JSON.parse(query.teamMethodologies))
    )
        whereCondition.teamMethodology = {
            [Op.in]: JSON.parse(query.teamMethodologies),
        }
    if (query.teamSizes && Array.isArray(JSON.parse(query.teamSizes)))
        whereCondition.teamSize = { [Op.in]: JSON.parse(query.teamSizes) }

    if (query.categoryIds && Array.isArray(JSON.parse(query.categoryIds)))
        whereCondition.categoryId = { [Op.in]: JSON.parse(query.categoryIds) }
    if (query.cityIds && Array.isArray(JSON.parse(query.cityIds)))
        whereCondition.cityId = { [Op.in]: JSON.parse(query.cityIds) }

    if (query.driveLicenses && Array.isArray(JSON.parse(query.driveLicenses))) {
        whereCondition.driveLicenses = {
            [Op.contains]: JSON.parse(query.driveLicenses),
        }
    }

    return whereCondition
}

export const mapQueryToOrderConditionResume = (query: any) => {
    const orderCondition = mapQueryToOrderCondition(query)

    if (query.workExperienceSort) {
        if (query.workExperienceSort === "true")
            orderCondition.push([
                sequelize.literal('"workExperienceYears"'),
                "DESC",
            ])
        else if (query.workExperienceSort === "false")
            orderCondition.push([
                sequelize.literal('"workExperienceYears"'),
                "ASC",
            ])
        else
            console.log(
                "Error, wrong workExperienceSort provided: ",
                query.workExperienceSort
            )
    }

    if (query.educationSort) {
        if (query.educationSort === "true")
            orderCondition.push([sequelize.literal('"educationYears"'), "DESC"])
        else if (query.educationSort === "false")
            orderCondition.push([sequelize.literal('"educationYears"'), "ASC"])
        else
            console.log(
                "Error, wrong educationSort provided: ",
                query.educationSort
            )
    }

    orderCondition.push(["updatedAt", "DESC"])
    return orderCondition
}

export const mapQueryToOrderConditionVacancy = (query: any) => {
    const orderCondition = mapQueryToOrderCondition(query)

    if (query.workExperienceSort) {
        if (query.workExperienceSort === "true")
            orderCondition.push(["workExperienceYearsMin", "DESC"])
        else if (query.workExperienceSort === "false")
            orderCondition.push(["workExperienceYearsMin", "ASC"])
        else
            console.log(
                "Error, wrong workExperienceSort provided: ",
                query.workExperienceSort
            )
    }

    orderCondition.push(["updatedAt", "DESC"])
    return orderCondition
}

export const mapQueryToOrderCondition = (query: any) => {
    const orderCondition = []

    if (query.salarySort) {
        if (query.salarySort === "true")
            orderCondition.push(["salaryMax", "DESC"])
        else if (query.salarySort === "false")
            orderCondition.push(["salaryMin", "ASC"])
        else console.log("Error, wrong salarySort provided: ", query.salarySort)
    }

    if (query.likesSort) {
        if (query.likesSort === "true")
            orderCondition.push([sequelize.literal('"likesCount"'), "DESC"])
        else if (query.likesSort === "false")
            orderCondition.push([sequelize.literal('"likesCount"'), "ASC"])
        else console.log("Error, wrong likesSort provided: ", query.likesSort)
    }

    if (query.viewsSort) {
        if (query.viewsSort === "true")
            orderCondition.push([sequelize.literal('"viewsCount"'), "DESC"])
        else if (query.viewsSort === "false")
            orderCondition.push([sequelize.literal('"viewsCount"'), "ASC"])
        else console.log("Error, wrong viewsSort provided: ", query.viewsSort)
    }

    if (query.respondsSort) {
        if (query.respondsSort === "true")
            orderCondition.push([sequelize.literal('"respondsCount"'), "DESC"])
        else if (query.respondsSort === "false")
            orderCondition.push([sequelize.literal('"respondsCount"'), "ASC"])
        else
            console.log(
                "Error, wrong respondsSort provided: ",
                query.respondsSort
            )
    }

    return orderCondition
}

export const mapQueryToWhereConditionCompany = (query: any) => {
    return {}
}

export const mapQueryToOrderConditionCompany = (query: any) => {
    return [["name", "ASC"]]
}

export const getResumeHtml = (resume: Resume): string => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8" />
          <title>raskolnikovv</title>
      </head>
      <body>
          <h1>${resume.title}</h1>
          <h1>${resume.user.firstName || ""} ${resume.user.lastName || ""}</h1>
          <ul>
          {{#each document.education}}
          <li>qualification name: {{this.qualificationName}}</li>
          <li>qualification type: {{this.qualificationType}}</li>
          <li>educationOrganization: {{this.educationOrganization.name}}</li>
          <br />
          {{/each}}
          </ul>
      </body>
      </html>
    `
}

export const getVacancyHtml = (vacancy: Vacancy): string => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8" />
          <title>raskolnikovv</title>
      </head>
      <body>
          <h1>${vacancy.title}</h1>
          <h1>${vacancy.user.firstName || ""} ${
        vacancy.user.lastName || ""
    }</h1>
          <ul>
          {{#each document.benefits}}
          <li>title: {{this.title}}</li>
          <br />
          {{/each}}
          </ul>
      </body>
      </html>
    `
}

export const htmlBlankWithEmailValidationCode = (
    validationCode: string
): string => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <title>raskolnikovv</title>
    </head>
    <body>
        <h1>Ваш код подтверждения: ${validationCode}</h1>
        <h3><a>https:
    </body>
    </html>
  `
}

export const htmlBlankWithEmailPasswordRecover = (password: string): string => {
    return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8" />
      <title>raskolnikovv</title>
  </head>
  <body>
      <h1>Ваш новый временный пароль: ${password}</h1>
      <h3><a>https:
  </body>
  </html>
`
}
