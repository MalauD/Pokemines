import sys
import pandas as pd
import requests


def import_csv(csv_file, ip_address, admin_password,solde_base):
    print(f"Importing {csv_file} to {ip_address}")
    s = requests.Session()
    print("Logging in")
    # Log in to the API
    response = s.post(f"http://{ip_address}/api/auth/login", json={"mail": "admin", "password": admin_password})
    if response.status_code != 200:
        print("Failed to log in")
        sys.exit(1)

    # For each row in the CSV file, send a POST request to the API endpoint
    df = pd.read_csv(csv_file,keep_default_na=False, na_values=['_'])
    passwords = []
    for index, row in df.iterrows():
        data = {
            "mail": row["Mail"],
            "first_name": row["Prenom"].title(),
            "last_name": row["Nom"],
            "account_balance": int(solde_base),
            "admin": False,
            "promo": row["Promotion"]
        }
        response = s.post(f"http://{ip_address}/api/auth/create_user", json=data)

        if response.status_code == 201:
            passwords.append(response.json()["password"])
        if response.status_code != 201:
            print(f"Failed to create user {row['Nom']} {row['Prenom']}")
            print(response.text)
            sys.exit(1)

        # Print progress rewritting the same line
        sys.stdout.write(f"\r{index + 1}/{len(df)}")
        sys.stdout.flush()

    # Append the passwords to the CSV file
    df["password"] = passwords
    df.to_csv(csv_file, index=False)
    
    print("\nDone")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python csv_importer.py <csv_file> <ip_address> <Solde base>")
        sys.exit(1)
    
    csv_file = sys.argv[1]
    ip_address = sys.argv[2]
    solde_base = sys.argv[3]
    admin_password = input("Enter the admin password: ")

    import_csv(csv_file, ip_address, admin_password,solde_base)