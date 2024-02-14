import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";
import { Navigate } from 'react-router-dom'

export default function UCSBOrganizationCreatePage() {

  const objectToAxiosParams = (ucsbOrganization) => ({
    url: "/api/ucsborganizations/post",
    method: "POST",
    params: {
      orgCode: ucsbOrganization.orgCode,
      orgTranslationShort: ucsbOrganization.orgTranslationShort,
      orgTranslation: ucsbOrganization.orgTranslation,
      inactive: ucsbOrganization.inactive
    }
  });

  const onSuccess = (ucsbOrganization) => {
    toast(`New UCSBOrganization Created - orgCode: ${ucsbOrganization.orgCode} inactive: ${ucsbOrganization.inactive}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    ["/api/ucsborganization/all"]
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    // Redirect to the UCSBOrganization index page after successful creation
    return <Navigate to="/ucsborganization" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New UCSBOrganization</h1>

        <UCSBOrganizationForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}
