package ru.itmentor.spring.boot_security.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class AuthController {

    @GetMapping("/login")
    public String loginPage() {
        return "auth/auth_page";
    }

    @GetMapping("/admin")
    public String adminPage() {
        return "/admin/admin_page";
    }

    @GetMapping("/user")
    public String userPage() {
        return "user/user_page";
    }
}
