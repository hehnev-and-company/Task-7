package ru.itmentor.spring.boot_security.demo.services;

import ru.itmentor.spring.boot_security.demo.model.User;

import java.security.Principal;
import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    User getUserByLogin(String login);
    User getUserById(long id);
    void addUser(User newUser);
    void editUser(User user);
    void deleteUser(User deleteUser);
}
