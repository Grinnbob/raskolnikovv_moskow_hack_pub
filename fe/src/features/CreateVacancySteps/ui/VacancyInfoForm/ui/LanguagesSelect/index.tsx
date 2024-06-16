'use client';

import { useEffect, useState } from 'react';
import { Text } from '@web/shared/ui/Text';
import { RxCross1 } from 'react-icons/rx';
import {
  BasePseudoSelect,
  Option,
} from '@web/entities/PseudoSelect/BasePseudoSelect';
import { LanguageModel } from '@web/shared/types/models/language.model';
import { languageProficiencyVariants } from '@web/shared/const/languageMappers';
import { AppButton } from '@web/shared/ui/buttons/AppButton';
import { GoPlus } from 'react-icons/go';
import { LanguageProficiency } from '@web/shared/types/enums/language';
import { getImageLink } from '@web/shared/lib/getImageLink';
import NextImage from '@web/shared/ui/NextImage';
import { useDidUpdateEffectDeep } from '@web/shared/lib/hooks/useDidUpdateEffect';

export type Titleable = Option &
  ({ title: string; label?: string } | { label: string; title?: string });

type LanguageModelWithProficiency = LanguageModel & {
  proficiency?: LanguageProficiency;
};

type SelectedLanguage = {
  proficiency?: LanguageProficiency;
  id?: number;
};

export type LanguagesSelectProps = {
  selectedLanguages?: SelectedLanguage[];
  languages: LanguageModel[];
  onChange: (model: LanguageModelWithProficiency[]) => void;
};

const renderOption = (item: LanguageModel) => (
  <div className='flex gap-2'>
    {item.imageName && (
      <NextImage
        src={getImageLink('countries', item.imageName)}
        alt={item.imageName}
        width={24}
        height={24}
      />
    )}
    <Text size='s'>{item.title}</Text>
  </div>
);

const renderOptionProficiency = (
  item: (typeof languageProficiencyVariants)[number],
) => <Text size='s'>{item.label}</Text>;

export const LanguagesSelect = ({
  selectedLanguages,
  languages,
  onChange,
}: LanguagesSelectProps) => {
  const [avaliableLanguages, setAvaliableLanguages] = useState(languages);
  const [rows, setRows] = useState<Array<LanguageModelWithProficiency>>([]);

  useEffect(() => {
    if (!selectedLanguages) return;
    const selectedLanguagesDict = selectedLanguages.reduce<
      Record<number, SelectedLanguage>
    >((acc, lang) => {
      if (lang.id) {
        acc[lang.id] = lang;
      }
      return acc;
    }, {});

    const avaliable: LanguageModel[] = [];
    const rows: LanguageModelWithProficiency[] = [];

    languages.forEach((lang) => {
      if (selectedLanguagesDict[lang.id]) {
        rows.push({
          ...lang,
          proficiency: selectedLanguagesDict[lang.id].proficiency,
        });
      } else {
        avaliable.push(lang);
      }
    });

    setAvaliableLanguages(avaliable);
    setRows(rows);
  }, [selectedLanguages, languages.length]);

  useDidUpdateEffectDeep(() => {
    onChange(rows);
  }, [rows]);

  return (
    <div>
      <Text size='s' className='mb-2 block font-medium'>
        Владение языком
      </Text>
      <div className='flex flex-col gap-3'>
        {rows?.map((row, index) => (
          <div
            className='flex justify-start w-full gap-4 items-center'
            key={row.id}
          >
            <BasePseudoSelect
              defaultSelected={row}
              data={avaliableLanguages}
              renderOption={renderOption}
              onSelect={(item) => {
                setAvaliableLanguages((prev) => {
                  const newArray = prev.filter((cur) => cur.id !== item.id);
                  newArray.push(row);
                  return newArray;
                });
                rows[index] = item;
                setRows((prev) => [...prev]);
              }}
              className='w-1/2'
              multiple={false}
            />
            <BasePseudoSelect
              defaultSelected={
                row.proficiency &&
                languageProficiencyVariants.find(
                  (cur) => row.proficiency === cur.value,
                )
              }
              onSelect={(item) => {
                setRows((prev) =>
                  prev.map((lang) => {
                    if (lang === row) {
                      return { ...lang, proficiency: item.value };
                    }
                    return lang;
                  }),
                );
              }}
              data={languageProficiencyVariants}
              renderOption={renderOptionProficiency}
              className='w-1/3'
              multiple={false}
            />
            <RxCross1
              size={16}
              className='cursor-pointer text-textLight'
              onClick={() => {
                setRows((prev) => prev.filter((cur) => cur.id !== row.id));
                setAvaliableLanguages((prev) => [...prev, row]);
              }}
            />
          </div>
        ))}
      </div>
      {avaliableLanguages.length > 0 && (
        <AppButton
          variant='outline'
          className='text-textBlue text-sm mt-2'
          icon={<GoPlus size={18} />}
          onClick={() => {
            const model = avaliableLanguages.pop();
            if (model) {
              setAvaliableLanguages((prev) => [...prev]);
              setRows((prev) => [...prev, model]);
            }
          }}
        >
          Добавить язык
        </AppButton>
      )}
    </div>
  );
};
