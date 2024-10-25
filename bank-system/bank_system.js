const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class BankSystem {
    constructor() {
        this.useraccounts = {}; 
    }

    addAccount(username, initialDeposit) {
        return new Promise((resolve, reject) => {
            if (this.useraccounts[username]) {
                reject("Account already exists!");
            } else {
                this.useraccounts[username] = { balance: initialDeposit };
                resolve(`Account created for ${username} with a balance of $${initialDeposit}.`);
            }
        });
    }

    

    deposit(username, amount) {
        return new Promise((resolve, reject) => {
            if (amount <= 0) {
                reject("Deposit amount must be positive.");
            } else {
                this.useraccounts[username].balance += amount;
                resolve(`Deposited $${amount}. New balance: $${this.useraccounts[username].balance}`);
            }
        });
    }

    withdraw(username, amount) {
        return new Promise((resolve, reject) => {
            if (amount <= 0) {
                reject("Withdrawal amount must be positive.");
            } else if (amount > this.useraccounts[username].balance) {
                reject("Insufficient funds.");
            } else {
                this.useraccounts[username].balance -= amount;
                resolve(`Withdrew $${amount}. New balance: $${this.useraccounts[username].balance}`);
            }
        });
    }

    checkBalance(username) {
        return Promise.resolve(`Your balance is: $${this.useraccounts[username].balance}`);
    }
}

const bank = new BankSystem();

function askQuestion(query) {
    return new Promise((resolve) => {
        rl.question(query, (answer) => resolve(answer));
    });
}

async function main() {
    const username = await askQuestion("Enter your username: ");
    const isNewUser = await askQuestion("Are you a new user? (yes/no): ");

    if (isNewUser.toLowerCase() === 'yes') {
        const initialDeposit = parseFloat(await askQuestion("Enter your initial deposit: "));
        bank.addAccount(username, initialDeposit)
            .then((message) => {
                console.log(message);
                showMenu(username);
            })
            .catch((error) => console.error(error));
    } else {
        bank.login(username)
            .then((message) => {
                console.log(message);
                showMenu(username);
            })
            .catch((error) => console.error(error));
    }
}

async function showMenu(username) {
    console.log("\nSelect an action by entering the corresponding number:");
    console.log("1. Deposit");
    console.log("2. Withdraw");
    console.log("3. Check Balance");
    console.log("4. Exit");

    const choice = await askQuestion("Your choice: ");

    switch (choice) {
        case "1":
            const depositAmount = parseFloat(await askQuestion("Enter deposit amount: "));
            bank.deposit(username, depositAmount)
                .then((message) => {
                    console.log(message);
                    showMenu(username);
                })
                .catch((error) => console.error(error));
            break;

        case "2":
            const withdrawAmount = parseFloat(await askQuestion("Enter withdrawal amount: "));
            bank.withdraw(username, withdrawAmount)
                .then((message) => {
                    console.log(message);
                    showMenu(username);
                })
                .catch((error) => console.error(error));
            break;

        case "3":
            bank.checkBalance(username)
                .then((message) => {
                    console.log(message);
                    showMenu(username);
                })
                .catch((error) => console.error(error));
            break;

        case "4":
            console.log("Thank you for using the bank system!");
            rl.close();
            break;

        default:
            console.log("Invalid choice. Please try again.");
            showMenu(username);
    }
}
main();
