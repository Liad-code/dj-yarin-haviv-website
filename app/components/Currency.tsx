"use client";

type Props = {
  value: number;
  locale: string;
  currency: string;
};

export function Currency({ value, locale, currency }: Props) {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });

  return <>{formatter.format(value)}</>;
}
