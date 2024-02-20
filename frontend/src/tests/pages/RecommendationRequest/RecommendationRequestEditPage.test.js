import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";
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

describe("RecommendationRequestEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/RecommendationRequest", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit RecommendationRequest");
            expect(screen.queryByTestId("RecommendationRequestForm-requesterEmail")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/RecommendationRequest", { params: { id: 17 } }).reply(200, {
                id: 17,
                requesterEmail: "student@ucsb.edu",
                professorEmail: "professor@ucsb.edu",
                explanation: "PhD program at Stanford",
                dateRequested: "2024-02-02T12:15",
                dateNeeded: "2024-02-02T12:15",
                done: "false"
            });
            axiosMock.onPut('/api/RecommendationRequest').reply(200, {
                id: "17",
                requesterEmail: "student@ucsb.edu",
                professorEmail: "professor@ucsb.edu",
                explanation: "PhD program at Harvard",
                dateRequested: "2024-02-02T12:15",
                dateNeeded: "2024-02-02T12:15",
                done: "true"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("RecommendationRequestForm-requesterEmail");

            const idField = screen.getByTestId("RecommendationRequestForm-id");
            const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
            const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
            const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
            const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
            const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
            const doneField = screen.getByTestId("RecommendationRequestForm-done");
            const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

            expect(idField).toHaveValue("17");
            expect(requesterEmailField).toHaveValue("student@ucsb.edu");
            expect(professorEmailField).toHaveValue("professor@ucsb.edu");
            expect(explanationField).toHaveValue("PhD program at Stanford");
            expect(dateRequestedField).toHaveValue("2024-02-02T12:15");
            expect(dateNeededField).toHaveValue("2024-02-02T12:15");
            expect(doneField).toHaveValue("false");
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("RecommendationRequestForm-requesterEmail");

            const idField = screen.getByTestId("RecommendationRequestForm-id");
            const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
            const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
            const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
            const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
            const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
            const doneField = screen.getByTestId("RecommendationRequestForm-done");
            const submitButton = screen.getByTestId("RecommendationRequestForm-submit"); 

            expect(idField).toHaveValue("17");
            expect(requesterEmailField).toHaveValue("student@ucsb.edu");
            expect(professorEmailField).toHaveValue("professor@ucsb.edu");
            expect(explanationField).toHaveValue("PhD program at Stanford");
            expect(dateRequestedField).toHaveValue("2024-02-02T12:15");
            expect(dateNeededField).toHaveValue("2024-02-02T12:15");
            expect(doneField).toHaveValue("false");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(requesterEmailField, { target: { value: "student@ucsb.edu" } })
            fireEvent.change(professorEmailField, { target: { value: "professor@ucsb.edu" } })
            fireEvent.change(explanationField, { target: { value: "PhD program at Harvard" } })
            fireEvent.change(dateRequestedField, { target: { value: "2024-02-02T12:15" } })
            fireEvent.change(dateNeededField, { target: { value: "2024-02-02T12:15" } })
            fireEvent.change(doneField, { target: { value: true } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("RecommendationRequest Updated - id: 17 requester email: student@ucsb.edu");
            expect(mockNavigate).toBeCalledWith({ "to": "/RecommendationRequest" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                requesterEmail: "student@ucsb.edu",
                professorEmail: "professor@ucsb.edu",
                explanation: "PhD program at Harvard",
                dateRequested: "2024-02-02T12:15",
                dateNeeded: "2024-02-02T12:15",
                done: "true"
            })); // posted object

        });


    });
});