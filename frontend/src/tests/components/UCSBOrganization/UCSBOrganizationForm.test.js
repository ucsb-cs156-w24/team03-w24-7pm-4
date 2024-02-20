import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
// Assuming you have a similar fixtures setup for organizations
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UCSBOrganizationForm tests", () => {
    const queryClient = new QueryClient();
    const testIdPrefix = "UCSBOrganizationForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );
    
        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        expect(screen.getByTestId(`${testIdPrefix}-orgCode`)).toBeInTheDocument();
        expect(screen.getByTestId(`${testIdPrefix}-orgTranslationShort`)).toBeInTheDocument();
        expect(screen.getByTestId(`${testIdPrefix}-orgTranslation`)).toBeInTheDocument();
        expect(screen.getByTestId(`${testIdPrefix}-orgCode`)).not.toBeDisabled();
    });
    

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm initialContents={ucsbOrganizationFixtures.oneOrganization} />
                </Router>
            </QueryClientProvider>
        );

        // Verify that the form fields are populated with initialContents
        expect(screen.getByTestId(`${testIdPrefix}-orgCode`)).toHaveValue(ucsbOrganizationFixtures.oneOrganization.orgCode);
        expect(screen.getByTestId(`${testIdPrefix}-orgTranslationShort`)).toHaveValue(ucsbOrganizationFixtures.oneOrganization.orgTranslationShort);
        expect(screen.getByTestId(`${testIdPrefix}-orgTranslation`)).toHaveValue(ucsbOrganizationFixtures.oneOrganization.orgTranslation);
        expect(screen.getByTestId(`${testIdPrefix}-orgCode`)).toBeDisabled();
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );

        const cancelButton = await screen.findByTestId(`${testIdPrefix}-cancel`);
        fireEvent.click(cancelButton);
        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );

        const submitButton = screen.getByTestId(`${testIdPrefix}-submit`);
        fireEvent.click(submitButton);

        // Check for required validation messages
        const orgTranslationShort = await screen.findByText(/Organization Translation Short is required/);
        const orgTranslation = await screen.findByText(/Organization Translation is required/);

        expect(orgTranslationShort).toBeInTheDocument();
        expect(orgTranslation).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/Organization Code is required/)).toBeInTheDocument();
        });
    });

    // Additional tests can be written to simulate user input, form submission, etc.
});
