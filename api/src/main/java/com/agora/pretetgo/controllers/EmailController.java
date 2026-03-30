package com.agora.pretetgo.controllers;

import com.agora.pretetgo.services.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/email")
@CrossOrigin(origins = "*")
@Tag(name = "Email", description = "Endpoints for managing emails")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @Operation(summary = "Send HTML email with subject (HTML in request body)")
    @PostMapping
    public ResponseEntity<String> sendHtmlEmailWithBody(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestBody String htmlContent) {

        emailService.sendEmail(to, subject, htmlContent);
        return ResponseEntity.ok("Email sent successfully to " + to);
    }

    @Operation(summary = "Send a verification email")
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestParam String email, @RequestParam String name) {
        String verificationLink = "https://google.com";

        emailService.sendTemplateEmail(
                email,
                "Verify Your Account",
                "verification",
                Map.of(
                        "name", name,
                        "link", verificationLink
                )
        );

        return ResponseEntity.ok("Registration successful! Check your email.");
    }
}