package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.UCSBDate;

import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;
import edu.ucsb.cs156.example.entities.RecommendationRequest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.time.LocalDateTime;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = RecommendationRequestController.class)
@Import(TestConfig.class)
public class RecommendationRequestControllerTests extends ControllerTestCase {
        @MockBean
        RecommendationRequestRepository RecommendationRequestRepository;
        @MockBean
        UserRepository userRepository;

        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/RecommendationRequest/all"))
                                .andExpect(status().is(403)); 
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/RecommendationRequest/all"))
                                .andExpect(status().is(200)); 
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_recommendationrequests() throws Exception {

                // arrange
                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
                LocalDateTime ldt1b = LocalDateTime.parse("2022-02-03T00:00:00");

                RecommendationRequest RecommendationRequest1 = RecommendationRequest.builder()
                                .requesterEmail("student@ucsb.edu")
                                .professorEmail("professor@ucsb.edu")
                                .explanation("Letter of Rec")
                                .dateRequested(ldt1)
                                .dateNeeded(ldt1b)
                                .done(false)
                                .build();

                LocalDateTime ldt2 = LocalDateTime.parse("2022-03-11T00:00:00");
                LocalDateTime ldt2b = LocalDateTime.parse("2022-04-11T00:00:00");

                RecommendationRequest RecommendationRequest2 = RecommendationRequest.builder()
                                .requesterEmail("student2@ucsb.edu")
                                .professorEmail("professor2@ucsb.edu")
                                .explanation("Second Letter of Rec")
                                .dateRequested(ldt2)
                                .dateNeeded(ldt2b)
                                .done(true)
                                .build();

                ArrayList<RecommendationRequest> expectedRequests = new ArrayList<>();
                expectedRequests.addAll(Arrays.asList(RecommendationRequest1, RecommendationRequest2));
                when(RecommendationRequestRepository.findAll()).thenReturn(expectedRequests);
                MvcResult response = mockMvc.perform(get("/api/RecommendationRequest/all"))
                                .andExpect(status().isOk()).andReturn();

                verify(RecommendationRequestRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedRequests);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }
        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/RecommendationRequest/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/RecommendationRequest/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_recommendationrequest() throws Exception {
                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
                LocalDateTime ldt1b = LocalDateTime.parse("2022-02-03T00:00:00");

                RecommendationRequest RecommendationRequest1 = RecommendationRequest.builder()
                                .requesterEmail("student@ucsb.edu")
                                .professorEmail("professor@ucsb.edu")
                                .explanation("Letter of Rec")
                                .dateRequested(ldt1)
                                .dateNeeded(ldt1b)
                                .done(true)
                                .build();

                when(RecommendationRequestRepository.save(eq(RecommendationRequest1))).thenReturn(RecommendationRequest1);

                MvcResult response = mockMvc.perform(
                                post("/api/RecommendationRequest/post?requesterEmail=student@ucsb.edu&professorEmail=professor@ucsb.edu&explanation=Letter of Rec&dateRequested=2022-01-03T00:00:00&dateNeeded=2022-02-03T00:00:00&done=true")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                verify(RecommendationRequestRepository, times(1)).save(RecommendationRequest1);
                String expectedJson = mapper.writeValueAsString(RecommendationRequest1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }
        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/RecommendationRequest?id=7"))
                                .andExpect(status().is(403)); 
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
                LocalDateTime ldt1b = LocalDateTime.parse("2022-02-03T00:00:00");

                RecommendationRequest RecommendationRequest1 = RecommendationRequest.builder()
                                .requesterEmail("student@ucsb.edu")
                                .professorEmail("professor@ucsb.edu")
                                .explanation("Letter of Rec")
                                .dateRequested(ldt1)
                                .dateNeeded(ldt1b)
                                .done(false)
                                .build();

                when(RecommendationRequestRepository.findById(eq(7L))).thenReturn(Optional.of(RecommendationRequest1));
                MvcResult response = mockMvc.perform(get("/api/RecommendationRequest?id=7"))
                                .andExpect(status().isOk()).andReturn();
                verify(RecommendationRequestRepository, times(1)).findById(eq(7L));
                String expectedJson = mapper.writeValueAsString(RecommendationRequest1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                when(RecommendationRequestRepository.findById(eq(7L))).thenReturn(Optional.empty());
                MvcResult response = mockMvc.perform(get("/api/RecommendationRequest?id=7"))
                                .andExpect(status().isNotFound()).andReturn();
                verify(RecommendationRequestRepository, times(1)).findById(eq(7L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("RecommendationRequest with id 7 not found", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_request() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
                LocalDateTime ldt1b = LocalDateTime.parse("2022-02-03T00:00:00");

                RecommendationRequest RecommendationRequest1 = RecommendationRequest.builder()
                                .requesterEmail("student@ucsb.edu")
                                .professorEmail("professor@ucsb.edu")
                                .explanation("Letter of Rec")
                                .dateRequested(ldt1)
                                .dateNeeded(ldt1b)
                                .done(false)
                                .build();

                when(RecommendationRequestRepository.findById(eq(15L))).thenReturn(Optional.of(RecommendationRequest1));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/RecommendationRequest?id=15")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(RecommendationRequestRepository, times(1)).findById(15L);
                verify(RecommendationRequestRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("RecommendationRequest with id 15 deleted", json.get("message"));
        }
        
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_recommendationrequest_and_gets_right_error_message()
                        throws Exception {
                when(RecommendationRequestRepository.findById(eq(15L))).thenReturn(Optional.empty());
                MvcResult response = mockMvc.perform(
                                delete("/api/RecommendationRequest?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(RecommendationRequestRepository, times(1)).findById(15L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("RecommendationRequest with id 15 not found", json.get("message"));
        }

        // Tests for PUT /api/recommendationrequest?id=... 

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_recommendationrequest() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
                LocalDateTime ldt2 = LocalDateTime.parse("2023-01-03T05:03:27");

                RecommendationRequest RecommendationRequestOrig = RecommendationRequest.builder()
                                .requesterEmail("student@ucsb.edu")
                                .professorEmail("professor@ucsb.edu")
                                .explanation("Letter of Rec")
                                .dateRequested(ldt1)
                                .dateNeeded(ldt1)
                                .done(false)
                                .build();

                RecommendationRequest RecommendationRequestEdited = RecommendationRequest.builder()
                                .requesterEmail("student1@ucsb.edu")
                                .professorEmail("professor1@ucsb.edu")
                                .explanation("Second Letter of Rec")
                                .dateRequested(ldt2)
                                .dateNeeded(ldt2)
                                .done(true)
                                .build();

                String requestBody = mapper.writeValueAsString(RecommendationRequestEdited);

                when(RecommendationRequestRepository.findById(eq(67L))).thenReturn(Optional.of(RecommendationRequestOrig));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/RecommendationRequest?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(RecommendationRequestRepository, times(1)).findById(67L);
                verify(RecommendationRequestRepository, times(1)).save(RecommendationRequestEdited); 
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_recommendationrequest_that_does_not_exist() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
                LocalDateTime ldt1b = LocalDateTime.parse("2022-02-03T05:11:22");

                RecommendationRequest RecommendationRequestEdited = RecommendationRequest.builder()
                                .requesterEmail("student@ucsb.edu")
                                .professorEmail("professor@ucsb.edu")
                                .explanation("Letter of Rec")
                                .dateRequested(ldt1)
                                .dateNeeded(ldt1b)
                                .done(true)
                                .build();

                String requestBody = mapper.writeValueAsString(RecommendationRequestEdited);

                when(RecommendationRequestRepository.findById(eq(67L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/RecommendationRequest?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(RecommendationRequestRepository, times(1)).findById(67L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("RecommendationRequest with id 67 not found", json.get("message"));
        }
}