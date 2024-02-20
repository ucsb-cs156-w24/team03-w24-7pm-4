import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function HelpRequestForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all

    const navigate = useNavigate();

    // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
    // Note that even this complex regex may still need some tweaks

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
    const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // {errors.requestTime?.type === 'pattern' && 'Request Time must be in iso format, e.g. YYYY-mm-ddTHH:MM:SS'}
    return (

        <Form onSubmit={handleSubmit(submitAction)}>
            <Row>
                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid="HelpRequestForm-id"
                                id="id"
                                type="text"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                )}

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="requestTime">requestTime (iso format)</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-requestTime"
                            id="requestTime"
                            type="datetime-local"
                            isInvalid={Boolean(errors.requestTime)}
                            {...register("requestTime", { required: true, pattern: isodate_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.requestTime && 'Request Time is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="teamId">teamId</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-teamId"
                            id="teamId"
                            type="text"
                            isInvalid={Boolean(errors.teamId)}
                            {...register("teamId", {
                                required: "teamId is required."
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.teamId?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="tableOrBreakoutRoom">tableOrBreakoutRoom</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-tableOrBreakoutRoom"
                            id="tableOrBreakoutRoom"
                            type="text"
                            isInvalid={Boolean(errors.tableOrBreakoutRoom)}
                            {...register("tableOrBreakoutRoom", {
                                required: "tableOrBreakoutRoom is required."
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.tableOrBreakoutRoom?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="explanation">explanation</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-explanation"
                            id="explanation"
                            type="text"
                            isInvalid={Boolean(errors.explanation)}
                            {...register("explanation", {
                                required: "explanation is required."
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.explanation?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="solved">solved</Form.Label>
                        <Form.Select
                            data-testid="HelpRequestForm-solved"
                            id="solved"
                            isInvalid={Boolean(errors.solved)}
                            {...register("solved", { required: "This field is required." })}
                        >
                            <option value="">-- Select an option --</option>
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.solved?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="requesterEmail">requesterEmail</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-requesterEmail"
                            id="requesterEmail"
                            type="text"
                            isInvalid={Boolean(errors.requesterEmail)}
                            {...register("requesterEmail", { required: true, pattern: email_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.requesterEmail && 'requester email should be in correct format.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                
            </Row>
            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid="HelpRequestForm-submit"
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid="HelpRequestForm-cancel"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>

    )
}

export default HelpRequestForm;
