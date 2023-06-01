package ru.itmentor.spring.boot_security.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.itmentor.spring.boot_security.demo.model.User;
import ru.itmentor.spring.boot_security.demo.repositories.UserRepository;

import java.security.Principal;
import java.util.List;

@Service
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(long id) {
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
    public void addUser(User newUser){
        userRepository.save(newUser);
    }

    @Override
    @Transactional
    public void editUser(User user) {
        User newUser = new User();
        if (user != null) {
            newUser = getUserById(user.getId());
            newUser.setFirstName(user.getFirstName());
            newUser.setLastName(user.getLastName());
            newUser.setEmail(user.getEmail());
        }
        userRepository.save(newUser);
    }

    @Override
    @Transactional
    public void deleteUser(User deleteUser) {
        userRepository.delete(deleteUser);
    }
}
