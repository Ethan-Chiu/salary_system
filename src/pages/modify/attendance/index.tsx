import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { api } from "~/utils/api";
import * as TABLE_NAMES from "../../table_names";
import { useRouter } from "next/router";
import Template from "../template";
import { Button } from "~/components/ui/button";
import { Translate } from "~/pages/develop_parameters/utils/translation";

const PageTitle = "Attendance Setting";

const Attendance: NextPageWithLayout = () => {
	const getAllAttendanceSetting =
		api.parameters.getAllAttendanceSetting.useQuery();
	const updateAttendanceSetting =
		api.parameters.updateAttendanceSetting.useMutation({
			onSuccess: () => {
				getAllAttendanceSetting.refetch();
			},
		});
	const createAttendanceSetting =
		api.parameters.createAttendanceSetting.useMutation({
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
		<div className="flex min-h-full flex-col">
			<div className="" />
			<Template
				headerTitle={PageTitle}
				table_name={TABLE_NAMES.TABLE_ATTENDANCE}
				queryFunction={getAllAttendanceSetting}
				updateFunction={updateAttendanceSetting}
				createFunction={createAttendanceSetting}
				deleteFunction={deleteAttendanceSetting}
			/>
		</div>
	);
};

Attendance.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle={PageTitle}>{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default Attendance;
