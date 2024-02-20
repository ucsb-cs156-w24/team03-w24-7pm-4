import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("HelpRequestCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /helprequest", async () => {

        const queryClient = new QueryClient();
        const request = {
            id: 3,
            requesterEmail: "test@ucsb.edu",
            explanation: "merge conflict",
            requestTime: "2023-02-02T11:11",
            solved: false,
            tableOrBreakoutRoom: "13",
            teamId: "s22-7pm-2"
        };

        axiosMock.onPost("/api/helprequest/post").reply(202, request);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("explanation")).toBeInTheDocument();
        });

        await screen.findByTestId("HelpRequestForm-requesterEmail");
        const explanationInput = screen.getByLabelText("explanation");
        expect(explanationInput).toBeInTheDocument();
        const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail")

        const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
        const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
        const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
        const solvedField = screen.getByTestId("HelpRequestForm-solved");

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(explanationInput, { target: { value: 'merge conflict' } })
        fireEvent.change(requestTimeField, { target: { value: '2023-02-02T11:11' } })
        fireEvent.change(requesterEmailField, { target: { value: 'test@ucsb.edu'} })
        fireEvent.change(teamIdField, { target: { value: 's22-7pm-2'} })
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: '13'} })
        fireEvent.change(solvedField, { target: { value: false} })
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            requesterEmail: "test@ucsb.edu",
            explanation: "merge conflict",
            requestTime: "2023-02-02T11:11",
            solved: "false",
            tableOrBreakoutRoom: "13",
            teamId: "s22-7pm-2"
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New Help Request Created - id: 3 teamId: s22-7pm-2");
        expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });

    });
});


