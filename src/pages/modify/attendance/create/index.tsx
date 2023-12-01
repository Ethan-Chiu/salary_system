import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../../../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { api } from "~/utils/api";
import * as TABLE_NAMES from "../../../table_names";
import { useRouter } from 'next/router';
import Template from "../../template";
import { SingleParameterSettings } from "../../ParameterForm";
import { getSchema } from "../../Schemas/getSchema";
import AutoForm from "~/components/ui/auto-form";

const PageTitle = "Create Attendance Setting"

const AttendanceCreate: NextPageWithLayout = () => {

	const getAllAttendanceSetting =
		api.parameters.getAllAttendanceSetting.useQuery();
	const updateAttendanceSetting =
		api.parameters.updateAttendanceSetting.useMutation({
			onSuccess: () => {
				getAllAttendanceSetting.refetch();
			},
		});
	const deleteAttendanceSetting = 
		api.parameters.deleteAttendanceSetting.useMutation({
			onSuccess: () => {
				getAllAttendanceSetting.refetch();
			},
		});

	return (
		<AutoForm
			formSchema={getSchema(TABLE_NAMES.TABLE_ATTENDANCE)!(data)}
		>
		</AutoForm>
		
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