package hr.ngs.templater.example;

import java.awt.*;
import java.math.BigDecimal;

public class Loan {
    private String bank;
    private BigDecimal amount;
    private Color color;

    public Loan(String bank, BigDecimal amount, Color color) {
        this.bank = bank;
        this.amount = amount;
        this.color = color;
    }

    public String getBank() {
        return bank;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public Color getColor() {
        return color;
    }
}
