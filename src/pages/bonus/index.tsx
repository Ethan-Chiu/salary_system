import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { Header } from "~/components/header";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { i18n, locales } from '~/components/lang_config'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select";
import { BonusTypeEnum, BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import TablesView from "./tables_view";
import dataTableContext from "./components/context/data_table_context";
import periodContext from "~/components/context/period_context";

const BonusHomePage: NextPageWithLayout = () => {
    const { selectedPeriod } = useContext(periodContext);
    const { t } = useTranslation(['common', 'nav']);
    const { selectedBonusType, setSelectedBonusType } = useContext(dataTableContext);

    return (
        <div className="flex h-screen flex-col">
            <Header title={t("bonus", { ns: "nav" })} showOptions className="mb-4" />
            <div className="flex flex-col items-start">
                <div className="flex ml-4">
                    <Select
                        defaultValue={selectedBonusType}
                        onValueChange={(chosen) => {
                            setSelectedBonusType(chosen as BonusTypeEnumType);
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("others.select_period")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>{t('others.period')}</SelectLabel>
                                {Object.values(BonusTypeEnum.Enum).map((bonus_type) => {
                                    return (
                                        <SelectItem
                                            key={bonus_type}
                                            value={bonus_type}
                                        >
                                            {t(`others.${bonus_type}`)}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="m-4 h-0 grow rounded-md border-2">
                <TablesView />
            </div>
        </div>
    );
};

BonusHomePage.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <RootLayout>
            <PerpageLayoutNav pageTitle="Bonus">{page}</PerpageLayoutNav>
        </RootLayout>
    );
};

export default BonusHomePage;

export const getStaticProps = async ({ locale }: { locale: string }) => {
    return ({
        props: {
            ...(await serverSideTranslations(locale, ["common", "nav"], i18n, locales)),
        }
    });
};