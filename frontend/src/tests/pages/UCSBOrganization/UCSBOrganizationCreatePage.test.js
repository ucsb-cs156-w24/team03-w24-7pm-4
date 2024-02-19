import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBOrganizationCreatePage from "main/pages/UCSBOrganization/UCSBOrganizationCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

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

describe("UCSBOrganizationCreatePage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
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
                    <UCSBOrganizationCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /ucsborganization", async () => {
        const ucsbOrganization = {
            orgCode: "123",
            orgTranslationShort: "Test Org Short",
            orgTranslation: "Test Organization",
            inactive: true
        };

        axiosMock.onPost("/api/ucsborganizations/post").reply(200, ucsbOrganization);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByLabelText("Organization Code")).toBeInTheDocument();
        });

        const orgCodeInput = screen.getByLabelText("Organization Code");
        const orgTranslationShortInput = screen.getByLabelText("Organization Translation Short");
        const orgTranslationInput = screen.getByLabelText("Organization Translation");
        const inactiveInput = screen.getByLabelText("Inactive");

        const createButton = screen.getByText("Create");

        fireEvent.change(orgCodeInput, { target: { value: '123' } });
        fireEvent.change(orgTranslationShortInput, { target: { value: 'Test Org Short' } });
        fireEvent.change(orgTranslationInput, { target: { value: 'Test Organization' } });
        fireEvent.click(inactiveInput);
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(ucsbOrganization);

        expect(mockToast).toBeCalledWith(`New UCSBOrganization Created - orgCode: ${ucsbOrganization.orgCode} inactive: ${ucsbOrganization.inactive}`);
        expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganization" });
    });

});
