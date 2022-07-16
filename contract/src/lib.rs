use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap};
use near_sdk::json_types::{U64, U128};
use near_sdk::serde::{Serialize, Deserialize};
use near_sdk::{env, near_bindgen, BorshStorageKey, AccountId, Balance, PanicOnDefault};

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
    DonationPerPerson,
    Donations
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Donation {
    id: U64,
    account_id: AccountId,
    balance: U128,
    donated_at: u64,
    msg: Option<String>
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    donation_per_person: UnorderedMap<AccountId, Balance>,
    donations: UnorderedMap<u64, Donation>,
    total_donated: Balance,
    owner: AccountId,
    donation_id_serial: u64
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(owner: AccountId) -> Self {
        Self {
            donation_per_person: UnorderedMap::new(StorageKey::DonationPerPerson),
            donations: UnorderedMap::new(StorageKey::Donations),
            total_donated: 0u128,
            owner,
            donation_id_serial: 0u64
        }
    }

    #[private]
    #[init(ignore_state)]
    pub fn migrate() -> Contract {
        let this: Contract = env::state_read().expect("Cannot deserialize");
        this
    }

    #[payable]
    pub fn donate(&mut self, msg: Option<String>) -> U64 {
        let account_id = env::predecessor_account_id();
        let deposit_value = env::attached_deposit();
        self.donation_id_serial += 1;
        let id = self.donation_id_serial;
        self.total_donated += deposit_value;
        let donation = Donation {
            id: U64::from(id),
            account_id: account_id.clone(),
            balance: U128::from(deposit_value),
            donated_at: env::block_timestamp(),
            msg,
        };

        self.donations.insert(&id, &donation);
        if let Some(balance_donated_of_account) = self.donation_per_person.get(&account_id) {
            let new_total_donated_by_account = balance_donated_of_account + deposit_value;
            self.donation_per_person.insert(&account_id, &new_total_donated_by_account);
        } else {
            self.donation_per_person.insert(&account_id, &deposit_value);
        }
        U64::from(id)
    }

    pub fn get_total_donated(&self) -> U128 {
        return U128::from(self.total_donated)
    }

    pub fn get_total_donated_by_person(&self, account_id: AccountId) -> U128 {
        let total = self.donation_per_person.get(&account_id).unwrap_or(0u128);
        U128::from(total)
    }

    pub fn get_donations(&self, from_index: Option<U64>, limit_documents: Option<u64>) -> Vec<Donation> {
        let start = from_index.unwrap_or(U64::from(0)).0;
        let limit = limit_documents.unwrap_or(0);

        self.donations.keys()
            .skip(start as usize)
            .take(limit as usize)
            .map(|id| {
                self.donations.get(&id).unwrap()
            })
            .collect()
    }
}
