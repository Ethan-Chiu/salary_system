import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";
import { Header } from "~/components/header";
import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { ReactElement } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

const TabOptions = ["基本檔案", "薪資檔案", "持股信託"];

const PageEmployees: NextPageWithLayout = () => {
    const router = useRouter();
    function getTable(table_name: string) {
        switch (table_name) {
            case "基本檔案":
                return <p>No implement</p>;
            case "薪資檔案":
                return <p>No implement</p>;
            case "持股信託":
                return <p>No implement</p>;
            default:
                return <p>No implement</p>;
        }
    }

    return (
        <>
            <Header title="employees" showOptions className="mb-4" />
            <div className="h-0 grow m-4">
                <Tabs
                    defaultValue={TabOptions[0]}
                    className="flex h-full w-full flex-col"
                >
                    <TabsList className={"grid w-full grid-cols-3"}>
                        {TabOptions.map((option) => {
                            return (
                                <TabsTrigger value={option}>
                                    {option}
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                    <div className="h-0 grow mt-2">
                        {TabOptions.map((option) => {
                            return (
                                <TabsContent value={option} className="h-full">
                                    {getTable(option)}
                                </TabsContent>
                            );
                        })}
                    </div>
                </Tabs>
            </div>
        </>
    );
};

PageEmployees.getLayout = function getLayout(page: ReactElement) {
    return (
        <RootLayout>
            <PerpageLayoutNav pageTitle="check">{page}</PerpageLayoutNav>
        </RootLayout>
    );
};

export default PageEmployees;
