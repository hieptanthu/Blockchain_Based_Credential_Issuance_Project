module my_address::SchoolManager {
    use sui::event;
    use sui::vec_set::{Self, VecSet};
    use sui::clock::{Self, Clock};
    
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_NOT_FIND_ADDRESS: u64 = 2;
    const E_EXISTED: u64 = 5;

    const EVENT_ADMIN_CREATE_ADMIN_SUPPER: u64 = 0;
    const EVENT_ADMIN_CHANGE_ADMIN_SUPPER: u64 = 1;
    const EVENT_ADMIN_CREATE_ADMIN: u64 = 3;
    const EVENT_ADMIN_DELETE_ADMIN: u64 = 4;
 
    const EVENT_SCHOOL_CREATE: u8 = 0;
    const EVENT_SCHOOL_UPDATE: u8 = 1;

    
  
    public struct AdminManager has key, store {
        id: UID,
        super_admin: address,     
        admins: VecSet<address>,
        codes_bytes: VecSet<vector<u8>>,
    }

    public struct School has key, store { 
        id: UID,
        admin: address,
        code_bytes: vector<u8>,
        ipfs_url_bytes: vector<u8>,
        status: bool
    }

    public struct AdminEvent has copy, drop{
        admin: address,
        event_type: u64,
        timestamp: u64
    }

    public struct SchoolEvent has copy, drop {
        code_bytes: vector<u8>,
        admin: address,
        ipfs_url_bytes: vector<u8>,
        status: bool,
        event_type: u8,
        timestamp: u64
    }


    fun init(__ctx: &mut TxContext) {
        let sender = tx_context::sender(__ctx);
        let mut admins = vec_set::empty<address>();
        let codes_bytes = vec_set::empty<vector<u8>>();
        vec_set::insert(&mut admins, sender);

        let admin_manager =AdminManager {
            id: object::new(__ctx),
            super_admin: sender, 
            admins,
            codes_bytes
        };

        transfer::share_object(admin_manager);

        event::emit(AdminEvent {
            admin: sender,
            event_type: EVENT_ADMIN_CREATE_ADMIN_SUPPER,
            timestamp: 0
        });

        event::emit(AdminEvent {
            admin: sender,
            event_type: EVENT_ADMIN_CREATE_ADMIN,
            timestamp: 0
        });
    }


    public fun get_id_and_admin_schools(s: &School): (&UID, address) {
        (&s.id, s.admin)
    }


    

    entry fun change_super_admin(admin_manager: &mut AdminManager, new_super_admin: address,  clock: &Clock, _ctx: &mut TxContext) {
        let sender = tx_context::sender(_ctx);
        assert!(admin_manager.super_admin == sender, E_NOT_AUTHORIZED);
        admin_manager.super_admin = new_super_admin;
        event::emit(AdminEvent {
            admin: sender,
            event_type:EVENT_ADMIN_CHANGE_ADMIN_SUPPER,
            timestamp: clock::timestamp_ms(clock)
        });
    }

    entry  fun create_admin(admin_manager:&mut AdminManager, new_admin:address, clock: &Clock, _ctx: &mut TxContext)  {
        let sender = tx_context::sender(_ctx);

        assert!(admin_manager.super_admin == sender, E_NOT_AUTHORIZED);

        vec_set::insert(&mut admin_manager.admins, new_admin);

        event::emit(AdminEvent {
            admin:new_admin,
            event_type:EVENT_ADMIN_CREATE_ADMIN,
            timestamp: clock::timestamp_ms(clock)
        });
     
    }

    entry fun remove_admin(admin_manager: &mut AdminManager,  remote_admin: address, clock: &Clock, _ctx:&mut TxContext) {
        let sender = tx_context::sender(_ctx);
        assert!(admin_manager.super_admin == sender, E_NOT_AUTHORIZED); 
        assert!(vec_set::contains(&admin_manager.admins, &remote_admin), E_NOT_FIND_ADDRESS); 
       
        vec_set::remove(&mut admin_manager.admins, &remote_admin);

        event::emit(AdminEvent {
            admin:remote_admin,
            event_type:EVENT_ADMIN_DELETE_ADMIN,
            timestamp: clock::timestamp_ms(clock)
        });
        

        
    }

    
    entry fun create_school(admin_manager: &mut AdminManager, code_bytes: vector<u8>, address_manager: address, ipfs_url_bytes: vector<u8>, status: bool, clock: &Clock, _ctx:&mut TxContext) {
        let sender = tx_context::sender(_ctx);

        assert!(vec_set::contains(&admin_manager.admins, &sender), E_NOT_AUTHORIZED);
        assert!(!vec_set::contains(&admin_manager.codes_bytes, &code_bytes), E_EXISTED);
        vec_set::insert(&mut admin_manager.codes_bytes, code_bytes);

        let new_school = School {
            id: object::new(_ctx),
            admin: address_manager,
            code_bytes: code_bytes,
            ipfs_url_bytes: ipfs_url_bytes,
            status: status
        };

        event::emit(SchoolEvent {
            code_bytes: new_school.code_bytes,
            admin: new_school.admin,
            ipfs_url_bytes: new_school.ipfs_url_bytes,
            status: new_school.status,
            event_type: EVENT_SCHOOL_CREATE,
            timestamp: clock::timestamp_ms(clock)
        });

        transfer::share_object(new_school);
          
    }


     entry fun update_school(admin_manager: &AdminManager, new_code_bytes: vector<u8>,school: &mut School,  new_admin: address,new_ipfs_bytes: vector<u8>, new_status: bool, clock: &Clock, _ctx: &mut TxContext) {
        let sender = tx_context::sender(_ctx);
        assert!(vec_set::contains(&admin_manager.admins, &sender), E_NOT_AUTHORIZED);
        let mut has_changes = false;

        if (school.admin != new_admin) {
            school.admin = new_admin;
            has_changes = true;
        };
        if (school.code_bytes != new_code_bytes) {
            school.code_bytes = new_code_bytes;
            has_changes = true;
        };
        if (school.ipfs_url_bytes != new_ipfs_bytes) {
            school.ipfs_url_bytes = new_ipfs_bytes;
            has_changes = true;
        };
        if (school.status != new_status) {
            school.status = new_status;
            has_changes = true;
        };

        if (has_changes) {
            event::emit(SchoolEvent {
                code_bytes: school.code_bytes,
                admin: school.admin,
                ipfs_url_bytes: school.ipfs_url_bytes,
                status:school.status,
                event_type: EVENT_SCHOOL_UPDATE,
                timestamp: clock::timestamp_ms(clock)
            });
        };
    }




}