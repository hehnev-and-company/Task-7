package ru.itmentor.spring.boot_security.demo.services;

import ru.itmentor.spring.boot_security.demo.model.Role;
import ru.itmentor.spring.boot_security.demo.model.User;

import java.util.Collection;
import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    User getUserByLogin(String login);
    User getUserById(Long id);
    void addUser(User newUser, Collection<Long> roleIds);
    void editUser(User user, Collection<Long> roleIds);
    void deleteUser(User deleteUser);
    Collection<Role> getRoles();
}
