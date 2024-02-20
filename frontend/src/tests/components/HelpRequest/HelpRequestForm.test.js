import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("HelpRequestForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByText(/requestTime/);
        await screen.findByText(/teamId/);
        await screen.findByText(/tableOrBreakoutRoom/);
        await screen.findByText(/explanation/);
        await screen.findByText(/solved/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a Help Request", async () => {

        render(
            <Router  >
                <HelpRequestForm initialContents={helpRequestFixtures.oneRequest} />
            </Router>
        );
        await screen.findByTestId(/HelpRequestForm-id/);
        const allLabelsIncludingId = screen.getAllByText(/Id/);
        expect(screen.getByTestId(/HelpRequestForm-id/)).toHaveValue("1");

        const idLabel = allLabelsIncludingId.find(label => label.textContent === 'Id');
        expect(idLabel).toBeInTheDocument();
    });


    test("Correct Error messages on bad input", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-requestTime");
        // await screen.findByTestId("HelpRequestForm-solved");
        const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail")
        const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
        const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
        const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
        const explanationField = screen.getByTestId("HelpRequestForm-explanation");
        const solvedField = screen.getByTestId("HelpRequestForm-solved");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(requestTimeField, { target: { value: 'bad-input' } });
        fireEvent.change(teamIdField, { target: { value: 'bad-input' } });
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: 'bad-input' } });
        fireEvent.change(explanationField, { target: { value: 'bad-input' } });
        fireEvent.change(solvedField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);
        
        // await screen.findByText(/This field is required./);
        await screen.findByText(/Request Time is required./);
    });

    test("Correct Error messages on missing input", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-submit");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Request Time is required./);
        expect(screen.getByText(/teamId is required./)).toBeInTheDocument();
        expect(screen.getByText(/explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/This field is required./)).toBeInTheDocument();
        expect(screen.getByText(/requester email should be in correct format./)).toBeInTheDocument();
        expect(screen.getByText(/tableOrBreakoutRoom is required./)).toBeInTheDocument();

    });

    test("No Error messages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <HelpRequestForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-requestTime");

        const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail")
        const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
        const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
        const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
        const explanationField = screen.getByTestId("HelpRequestForm-explanation");
        const solvedField = screen.getByTestId("HelpRequestForm-solved");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'cgaucho@ucsb.edu' } });
        fireEvent.change(teamIdField, { target: { value: 's22-7pm-3' } });
        fireEvent.change(requestTimeField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: '7' } });
        fireEvent.change(explanationField, { target: { value: 'merge conflict' } });
        fireEvent.change(solvedField, { target: { value: true } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Request Time is required./)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-cancel");
        const cancelButton = screen.getByTestId("HelpRequestForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


