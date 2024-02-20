import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function HelpRequestEditPage({storybook=false}) {
    let { id } = useParams();

    const { data: request, _error, _status } =
        useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/helprequest?id=${id}`],
            {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
            method: "GET",
            url: `/api/helprequest`,
            params: {
                id
            }
            }
        );


    const objectToAxiosPutParams = (request) => ({
        url: "/api/helprequest",
        method: "PUT",
        params: {
            id: request.id,
        },
        data: {
            requesterEmail: request.requesterEmail,
            explanation: request.explanation,
            requestTime: request.requestTime,
            solved: request.solved,
            tableOrBreakoutRoom: request.tableOrBreakoutRoom,
            teamId: request.teamId
        }
    });

    const onSuccess = (request) => {
        toast(`Help Request Updated - id: ${request.id} teamId: ${request.teamId}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/helprequest?id=${id}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/helprequest" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit HelpRequest</h1>
                {
                    request && <HelpRequestForm initialContents={request} submitAction={onSubmit} buttonLabel="Update" />
                }
            </div>
        </BasicLayout>
    )
}

