package com.agora.pretetgo.controllers;

import com.agora.pretetgo.services.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/email")
@CrossOrigin(origins = "*")
@Tag(name = "Email", description = "Endpoints for managing emails")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @Operation(summary = "Send a verification email")
    @PostMapping
    public String register(@RequestParam String email, @RequestParam String name) {
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

        return "Registration successful! Check your email.";
    }
}