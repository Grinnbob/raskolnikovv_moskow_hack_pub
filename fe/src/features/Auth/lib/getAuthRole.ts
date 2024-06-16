import { EAppCookieKeys } from '@web/shared/types/enums/common';
import { Roles } from '@web/shared/types/models/role.model';
import { NextApiRequest } from 'next';

const roleValues = Object.values(Roles);

export const getAuthRole = (req: NextApiRequest): Roles => {
  const cookieRole = (
    req.cookies._parsed as unknown as Map<
      string,
      { name: string; value: string }
    >
  )?.get?.(EAppCookieKeys.authRole);

  if (cookieRole?.value && roleValues.includes(cookieRole.value as Roles)) {
    return cookieRole.value as Roles;
  }

  return Roles.candidate;
};
