package ru.itmentor.spring.boot_security.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.itmentor.spring.boot_security.demo.model.Role;
import ru.itmentor.spring.boot_security.demo.model.User;
import ru.itmentor.spring.boot_security.demo.repositories.RoleRepository;
import ru.itmentor.spring.boot_security.demo.repositories.UserRepository;

import java.security.Principal;
import java.util.Collection;
import java.util.List;

@Service
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException(String.format("User with id: '%s' not found", id)));
    }

    @Override
    public User getUserByLogin(String login) {
        return userRepository.findByLogin(login)
                .orElseThrow(() -> new UsernameNotFoundException(String.format("User with login: '%s' not found", login)));
    }

    @Override
    @Transactional
    public void addUser(User newUser, Collection<Long> roleIds){
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        newUser.setRoles(roleRepository.findAllById(roleIds));
        userRepository.save(newUser);
    }

    @Override
    @Transactional
    public void editUser(User user, Collection<Long> roleIds) {
       user.setPassword(passwordEncoder.encode(user.getPassword()));
       user.setRoles(roleRepository.findAll());
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(User deleteUser) {
        userRepository.delete(deleteUser);
    }

    @Override
    public Collection<Role> getRoles() {
        return roleRepository.findAll();
    }
}
