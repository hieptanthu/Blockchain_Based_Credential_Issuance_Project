module my_address::DegreeManagement {
    use sui::event;
    use sui::clock::{Self, Clock};

    use my_address::SchoolManager;
    use my_address::SchoolManager::{School};

    const E_NOT_AUTHORIZED: u64 = 0;
    const EVENT_DEGREE_CREATE: u64 = 1;
    const EVENT_DEGREE_UPDATE: u64 = 2;
    const EVENT_DEGREE_DELETE: u64 = 3;


    public struct Degree has key, store {
        id: UID,
        school_address: address,
        ipfs_url_bytes: vector<u8>,
        status: bool,
        timestamp: u64,
    }


    public struct DegreeEvent has copy, drop {
        degree_id: address,
        school_address: address,
        ipfs_url_bytes: vector<u8>,
        status: bool,
        event_type: u64,
        timestamp: u64,
    }


    entry fun create_degree(school: &School,ipfs_url_bytes: vector<u8>,clock: &Clock,_ctx: &mut TxContext): (address) {
        let sender = tx_context::sender(_ctx);
        let (school_uid_ref, admin_addr) = SchoolManager::get_id_and_admin_schools(school);
        assert!(admin_addr == sender, E_NOT_AUTHORIZED);

        let degree = Degree {
            id: object::new(_ctx),
            school_address: object::uid_to_address(school_uid_ref),
            ipfs_url_bytes,
            timestamp: clock::timestamp_ms(clock),
            status: true
        };

        let degree_id = object::uid_to_address(&degree.id);

        event::emit(DegreeEvent {
            degree_id,
            school_address: degree.school_address,
            ipfs_url_bytes: degree.ipfs_url_bytes,
            event_type: EVENT_DEGREE_CREATE,
            status: degree.status,
            timestamp: degree.timestamp
        });

        transfer::share_object(degree);
        (degree_id) 
    }


   
    entry fun create_multiple_degrees(school: &School, ipfs_urls_bytes: vector<vector<u8>>, clock: &Clock, _ctx: &mut TxContext): vector<address> {  // Sửa thành vector<address>
        let sender = tx_context::sender(_ctx);
        let (school_uid_ref, admin_addr) = SchoolManager::get_id_and_admin_schools(school);
        assert!(admin_addr == sender, E_NOT_AUTHORIZED);
        let ipfs_len = vector::length(&ipfs_urls_bytes);
        let mut degree_ids = vector::empty<address>();  
        let school_address= object::uid_to_address(school_uid_ref);
        let mut i = 0;

        while (i < ipfs_len) {
            let ipfs_url_bytes = *vector::borrow(&ipfs_urls_bytes, i);

            let degree = Degree {
                id: object::new(_ctx),
                school_address:school_address,
                ipfs_url_bytes,
                timestamp: clock::timestamp_ms(clock),
                status: true
            };

            let degree_id = object::uid_to_address(&degree.id);

            event::emit(DegreeEvent {
                degree_id,
                school_address: degree.school_address,
                ipfs_url_bytes: degree.ipfs_url_bytes,
                event_type: EVENT_DEGREE_CREATE,
                status: true,
                timestamp: degree.timestamp,
            });

            vector::push_back(&mut degree_ids, degree_id);  // Thêm degree_id vào danh sách
            transfer::share_object(degree);
            i = i + 1;
        };
        degree_ids
    }


    entry fun update_degree(
        school: &School,
        degree: &mut Degree,
        new_ipfs_url_bytes: vector<u8>,
        new_status: bool,
        clock: &Clock,
        _ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(_ctx);
    
        let (_, admin_addr) = SchoolManager::get_id_and_admin_schools(school);

        assert!(admin_addr == sender, E_NOT_AUTHORIZED);

        let mut has_changes = false;

        if (degree.ipfs_url_bytes != new_ipfs_url_bytes) {
            degree.ipfs_url_bytes = new_ipfs_url_bytes;
            has_changes = true;
        };

        if (degree.status != new_status) {
            degree.status = new_status;
            has_changes = true;
        };

        if (has_changes) {
            degree.timestamp = clock::timestamp_ms(clock);
            event::emit(DegreeEvent {
                degree_id: object::uid_to_address(&degree.id),
                school_address: degree.school_address,
                ipfs_url_bytes: degree.ipfs_url_bytes,
                event_type: EVENT_DEGREE_UPDATE,
                timestamp: degree.timestamp,
                status:degree.status
            });
        };
    }

     entry fun delete_degree(
        school: &School,
        degree: Degree,
        clock: &Clock,
        _ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(_ctx);
        
        let (_, admin_addr) = SchoolManager::get_id_and_admin_schools(school);
        assert!(admin_addr == sender, E_NOT_AUTHORIZED);


        let Degree {
            id,
            school_address,
            ipfs_url_bytes,
            timestamp: _,
            status
        } = degree;

        let degree_id = object::uid_to_address(&id);

        event::emit(DegreeEvent {
            degree_id,
            school_address,
            ipfs_url_bytes,
            event_type: EVENT_DEGREE_DELETE,
            timestamp: clock::timestamp_ms(clock),
            status
        });

        object::delete(id);
    }
}