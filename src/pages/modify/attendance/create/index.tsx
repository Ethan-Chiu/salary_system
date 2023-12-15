import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../../../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { api } from "~/utils/api";
import * as TABLE_NAMES from "../../../table_names";
import { useRouter } from 'next/router';
import Template from "../../template";
import { SingleParameterSettings } from "../../ParameterForm";
import { getSchema } from "../../Schemas/getSchema";
import { Button } from "~/components/ui/button";
import AutoForm, {AutoFormSubmit} from "~/components/ui/auto-form";
import { attendanceSchema } from "../../Schemas/attendanceSchema";
import { Header } from "~/components/header";
import { Translate } from "~/pages/develop_parameters/utils/translation";

const PageTitle = "Create Attendance Setting"

const AttendanceCreate: NextPageWithLayout = () => {
	const router = useRouter();
	const serializedData = router.query.data;

	const getCurrentAttendanceSetting =
		api.parameters.getCurrentAttendanceSetting.useQuery();
	const createAttendanceSetting =
		api.parameters.createAttendanceSetting.useMutation({
			onSuccess: () => {
				getCurrentAttendanceSetting.refetch();
			},
		});
	return (
		<>
		<Header title={"新增["+TABLE_NAMES.TABLE_ATTENDANCE+"]參數"} showOptions/>
		<br/>
		{(getCurrentAttendanceSetting.isFetched)?
		<AutoForm
			formSchema={attendanceSchema(getCurrentAttendanceSetting.data, true)}
			onSubmit={(data) => {
				try {
					const updatedData = {
						...data,
						end_date: (data as any).end_date ? (data as any).end_date : null,
					};
					console.log(data);
					console.log(updatedData);
					createAttendanceSetting.mutate(updatedData);
				} catch(e) {
					console.log(e);
				}
			}}
			Translate={Translate}
		>
			<AutoFormSubmit>Create</AutoFormSubmit>
		</AutoForm>:
		<></>}
		</>
	);
};

AttendanceCreate.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle={PageTitle}>
				{page}
			</PerpageLayoutNav>
		</RootLayout>
	);
};

export default AttendanceCreate;