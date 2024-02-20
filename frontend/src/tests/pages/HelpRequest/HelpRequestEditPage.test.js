import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

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
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("HelpRequestEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit HelpRequest");
            expect(screen.queryByTestId("HelpRequestForm-solved")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).reply(200, {
                "id": 2,
                "requesterEmail": "ksd@ucsb.edu",
                "teamId": "s22-4pm-1",
                "tableOrBreakoutRoom": "5",
                "requestTime": "2022-05-11T11:22",
                "explanation": "Fail to build",
                "solved": true,
            });
            axiosMock.onPut('/api/helprequest').reply(200, {
                "id": 2,
                "requesterEmail": "newEmail@ucsb.edu",
                "teamId": "s23-7pm-3",
                "tableOrBreakoutRoom": "15",
                "requestTime": "2023-04-11T22:11",
                "explanation": "New bug",
                "solved": false,
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-requestTime");
            await screen.findByTestId("HelpRequestForm-requesterEmail");

            const idField = screen.getByTestId("HelpRequestForm-id")
            const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail")
            const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
            const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
            const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
            const explanationField = screen.getByTestId("HelpRequestForm-explanation");
            const solvedField = screen.getByTestId("HelpRequestForm-solved");
            const submitButton = screen.getByTestId("HelpRequestForm-submit");

            expect(idField).toHaveValue("2");
            expect(requesterEmailField).toHaveValue("ksd@ucsb.edu");
            expect(requestTimeField).toHaveValue("2022-05-11T11:22");
            expect(teamIdField).toHaveValue("s22-4pm-1");
            expect(tableOrBreakoutRoomField).toHaveValue("5");
            expect(explanationField).toHaveValue("Fail to build");
            expect(solvedField).toHaveValue("true");
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-requestTime");
            await screen.findByTestId("HelpRequestForm-requesterEmail");

            const idField = screen.getByTestId("HelpRequestForm-id")
            const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail")
            const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
            const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
            const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
            const explanationField = screen.getByTestId("HelpRequestForm-explanation");
            const solvedField = screen.getByTestId("HelpRequestForm-solved");
            const submitButton = screen.getByTestId("HelpRequestForm-submit");

            expect(idField).toHaveValue("2");
            expect(requesterEmailField).toHaveValue("ksd@ucsb.edu");
            expect(requestTimeField).toHaveValue("2022-05-11T11:22");
            expect(teamIdField).toHaveValue("s22-4pm-1");
            expect(tableOrBreakoutRoomField).toHaveValue("5");
            expect(explanationField).toHaveValue("Fail to build");
            expect(solvedField).toHaveValue("true");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(requesterEmailField, { target: { value: 'newEmail@ucsb.edu' } });
            fireEvent.change(teamIdField, { target: { value: 's23-7pm-3' } });
            fireEvent.change(requestTimeField, { target: { value: '2023-04-11T22:11' } });
            fireEvent.change(tableOrBreakoutRoomField, { target: { value: '15' } });
            fireEvent.change(explanationField, { target: { value: 'New bug' } });
            fireEvent.change(solvedField, { target: { value: "false" } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Help Request Updated - id: 2 teamId: s23-7pm-3");
            expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 2 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                "requesterEmail": "newEmail@ucsb.edu",
                "explanation": "New bug",
                "requestTime": "2023-04-11T22:11",
                "solved": "false",
                "tableOrBreakoutRoom": "15",
                "teamId": "s23-7pm-3",
            })); // posted object

        });

       
    });
});


