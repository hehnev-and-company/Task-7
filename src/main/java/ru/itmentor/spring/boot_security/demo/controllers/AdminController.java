package ru.itmentor.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import ru.itmentor.spring.boot_security.demo.model.Role;
import ru.itmentor.spring.boot_security.demo.model.User;
import ru.itmentor.spring.boot_security.demo.services.UserService;

import java.security.Principal;
import java.util.Collection;


@Controller
@RequestMapping("/admin")
public class AdminController {
    private final UserService userService;

    @Autowired
    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping()
    public String showAllUsers(ModelMap model, Principal principal) {
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("user", userService.getUserByLogin(principal.getName()));
        model.addAttribute("roles", userService.getRoles());
        return "admin/admin_page";
    }

    @GetMapping("/{id}")
    public String showUserById(@PathVariable("id") Long id, ModelMap model) {
        model.addAttribute("users", userService.getUserById(id));
        return "admin/admin_page";
    }

    @PostMapping()
    public String addNewUser(@ModelAttribute("user") User user, @RequestParam Collection<Long> roleIds) {
        userService.addUser(user, roleIds);
        return "redirect:/admin";
    }

    @PostMapping("/{id}")
    public String editUser(@ModelAttribute("user") User user, @RequestParam Collection<Long> roleIds) {
        userService.editUser(user, roleIds);
        return "redirect:/admin";
    }

    @PostMapping("/delete/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(userService.getUserById(id));
        return "redirect:/admin";
    }
}
