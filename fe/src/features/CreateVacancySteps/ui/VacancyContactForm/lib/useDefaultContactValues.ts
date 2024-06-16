import { ContactsModel } from '@web/shared/types/models/contacts.model';
import { useMemo } from 'react';

export const socials = ['telegram', 'vk', 'linkedin', 'facebook'] as const;
export type SocialNames = (typeof socials)[number];
export type SocialInput = {
  id?: string;
  label: string;
  name: (typeof socials)[number];
  placeholder: string;
  mask: string;
  value?: string;
};
export const socialInputs: Record<SocialNames, SocialInput> = {
  facebook: {
    label: 'Facebook',
    name: 'facebook',
    placeholder: 'facebook.com/account',
    mask: 'f\\acebook.com/*{0,}',
  },
  vk: {
    label: 'VK',
    name: 'vk',
    placeholder: 'vk.com/account',
    mask: 'vk.com/*{0,}',
  },
  linkedin: {
    label: 'Linkedin',
    name: 'linkedin',
    placeholder: 'linkedin.com/account',
    mask: 'linkedin.com/*{0,}',
  },
  telegram: {
    label: 'Telegram',
    name: 'telegram',
    placeholder: 'tg.io/account',
    mask: 'tg.io/*{0,}',
  },
};

type Valueable = { value?: string };
type Values = {
  emails: Array<Valueable>;
  phones: Array<Valueable>;
  socials: Array<SocialInput>;
};
export const useDefaultContactValues = (
  contacts: ContactsModel[],
  contactId?: number,
) => {
  return useMemo(() => {
    const values: Values = {
      emails: [{}],
      phones: [],
      socials: [],
    };
    const selectedContact = contacts.find(
      (contact) => contact.id === contactId,
    );

    if (selectedContact) {
      selectedContact.email &&
        (values.emails[0] = { value: selectedContact.email });
      selectedContact.secondEmail &&
        values.emails.push({ value: selectedContact.secondEmail });
      selectedContact.phone &&
        values.phones.push({ value: selectedContact.phone });
      selectedContact.secondPhone &&
        values.phones.push({ value: selectedContact.secondPhone });
      socials.forEach((social) => {
        selectedContact[social] &&
          values.socials.push({
            ...socialInputs[social],
            value: selectedContact[social],
          });
      });
    }

    return { defaultValues: values, selectedContact };
  }, [contacts, contactId]);
};
