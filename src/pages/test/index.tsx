import { Button } from "primereact/button";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";

import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";

export default function Test() {
  const handleOnClick = () => {
    confirmDialog({
      message: "Are you sure you want to log out?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {},
      reject: () => {}
    });
  };

  return (
    <div>
      <p onClick={handleOnClick} ></p>
      <ConfirmDialog />
    </div>
  );
}
