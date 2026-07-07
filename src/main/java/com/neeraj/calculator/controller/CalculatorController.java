package com.neeraj.calculator.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class CalculatorController {

    @GetMapping("/calculate")
    public Map<String, Object> calculate(
            @RequestParam double num1,
            @RequestParam double num2,
            @RequestParam String operation
    ) {
        double result = 0;
        String error = null;

        switch (operation) {
            case "add":
                result = num1 + num2;
                break;
            case "subtract":
                result = num1 - num2;
                break;
            case "multiply":
                result = num1 * num2;
                break;
            case "divide":
                if (num2 == 0) {
                    error = "Cannot divide by zero.";
                } else {
                    result = num1 / num2;
                }
                break;
            default:
                error = "Invalid operation.";
        }

        if (error != null) {
            return Map.of("error", error);
        }

        return Map.of("result", result);
    }
}
