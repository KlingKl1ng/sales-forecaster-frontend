(function () {
    const SECTION_IDS = [
        'overview', 'modules', 'activity', 'reports', 'profile', 'security', 'settings',
        'admin-overview', 'admin-users', 'admin-invites', 'admin-jobs', 'admin-audit',
    ];

    const TRANSLATIONS = {
        en: {
            page_title: 'Operartis | Member Dashboard',
            nav: {
                member_dashboard: 'Member Dashboard',
                admin_dashboard: 'Admin Dashboard',
                configuration: 'Configuration',
                overview: 'Overview',
                modules: 'Modules',
                activity: 'Activity',
                reports: 'Reports',
                profile: 'Profile',
                security: 'Security',
                settings: 'Settings',
                users: 'Users',
                invites: 'Invites',
                all_jobs: 'All Jobs',
                audit_log: 'Audit Log',
                dashboard: 'Dashboard',
            },
            chrome: {
                welcome: 'Welcome, {name}',
                member: 'Member',
                signed_in: 'Signed in',
                back_to_operartis: 'Back to Operartis',
                logout: 'Logout',
                open_menu: 'Open dashboard menu',
                close_menu: 'Close dashboard menu',
                collapse_sidebar: 'Collapse sidebar',
                expand_sidebar: 'Expand sidebar',
                footer_title: 'Operartis Analytics',
                footer_slogan: 'Optimizing Today, Growing Tomorrow',
            },
            access: {
                subtitle: 'Dashboard',
                title: 'Sign In To Continue',
                body: 'Sign in with your invited account to manage your profile, open modules, view retained reports, and change your password.',
                sign_in: 'Sign In',
                back_to_site: 'Back To Site',
            },
            sections: {
                overview: {
                    title: 'Overview',
                    subtitle: 'Your optimization workspace.',
                    eyebrow: 'Member Workspace',
                    h1: 'Your Dashboard',
                    sub: 'Track optimization activity, manage your account, and reopen frequently used modules from one place.',
                    retention: 'Retention: {days} days',
                    module_shortcuts: 'Module Shortcuts',
                    module_shortcuts_sub: 'The fastest route to your optimization tools.',
                    all_modules: 'All Modules',
                    profile_completion: 'Profile Completion',
                    profile_completion_sub: 'Complete profile data helps future team and company-level workflows.',
                    edit: 'Edit',
                    recent_runs: 'Recent Module Runs',
                    recent_runs_sub: 'Latest work linked to your member account.',
                    view_activity: 'View Activity',
                },
                modules: {
                    title: 'Modules',
                    subtitle: 'Open the tools available to your account.',
                    eyebrow: 'Optimization Modules',
                    h1: 'Module Shortcuts',
                    sub: 'Open the operational modules available to your account.',
                },
                activity: {
                    title: 'Activity',
                    subtitle: 'Review your module runs and upload history.',
                    eyebrow: 'Run History',
                    h1: 'Activity',
                    sub: 'Review uploads, processing status, and retained module activity.',
                },
                reports: {
                    title: 'Reports',
                    subtitle: 'Download retained outputs before cleanup.',
                    eyebrow: 'Retained Outputs',
                    h1: 'Reports',
                    sub: 'Download retained outputs before the automatic cleanup window ends.',
                    available_downloads: 'Available Downloads',
                    available_downloads_sub: 'Reports and artifacts still available.',
                    run_status: 'Run Status',
                    run_status_sub: 'Distribution of your current job history.',
                },
                profile: {
                    title: 'Profile',
                    subtitle: 'Manage your member information.',
                    eyebrow: 'Account Details',
                    h1: 'Profile',
                    sub: 'Update your member profile and avatar.',
                },
                security: {
                    title: 'Security',
                    subtitle: 'Update your password and account access.',
                    eyebrow: 'Account Protection',
                    h1: 'Security',
                    sub: 'Change your password and keep your member account protected.',
                    change_password: 'Change Password',
                    change_password_sub: 'After saving, other active sessions for this account are closed.',
                    current_password: 'Current Password',
                    new_password: 'New Password',
                    confirm_password: 'Confirm New Password',
                    update_password: 'Update Password',
                    account_access: 'Account Access',
                    account_access_sub: 'What this member account can currently access.',
                },
                settings: {
                    title: 'Settings',
                    subtitle: 'Theme and language preferences.',
                    eyebrow: 'Preferences',
                    h1: 'Settings',
                    sub: 'Theme and language stay in sync with Operartis home and your optimization modules.',
                    theme_mode: 'Theme Mode',
                    theme_mode_sub: 'Shared with index, forecaster, ML forecaster, inventory, and ABC-XYZ.',
                    language: 'Language',
                    language_sub: 'Applies to translated Operartis pages and modules.',
                    theme_aria: 'Theme mode',
                    language_aria: 'Language',
                },
                'admin-overview': {
                    title: 'Overview',
                    subtitle: 'Manage organization-level activity.',
                    eyebrow: 'Organization Control',
                    h1: 'Overview',
                    sub: 'Manage users, invites, jobs, and audit events from the same workspace.',
                },
                'admin-users': {
                    title: 'Users',
                    subtitle: 'Manage roles and account status.',
                    eyebrow: 'User Management',
                    h1: 'Users',
                    sub: 'Change roles and suspend or reactivate accounts. Passwords are never shown.',
                },
                'admin-invites': {
                    title: 'Invites',
                    subtitle: 'Create and revoke account invites.',
                    eyebrow: 'Access Control',
                    h1: 'Invites',
                    sub: 'Create invite links and revoke pending invites before they are accepted.',
                },
                'admin-jobs': {
                    title: 'All Jobs',
                    subtitle: 'Monitor organization module runs.',
                    eyebrow: 'Organization Activity',
                    h1: 'All Jobs',
                    sub: 'Review module runs across the organization.',
                },
                'admin-audit': {
                    title: 'Audit Log',
                    subtitle: 'Review recent security and admin events.',
                    eyebrow: 'Security Trail',
                    h1: 'Audit Log',
                    sub: 'Recent admin and security events for the organization.',
                },
            },
            theme: { light: 'Light', dark: 'Dark', system: 'System' },
            lang_labels: {
                en_sub: 'US English',
                vi_sub: 'Vietnamese',
                de_sub: 'German',
            },
            metrics: {
                runs: 'Runs',
                runs_note: '{count} completed',
                active: 'Active',
                active_note: 'Queued or processing',
                downloads: 'Downloads',
                downloads_note: 'Available now',
                profile: 'Profile',
                profile_note: 'Member information',
            },
            actions: { open: 'Open', open_module: 'Open Module', available: 'available', download: 'Download' },
            messages: {
                lang_saved: 'Language preference saved.',
                request_failed: 'Request failed.',
                dashboard_load_failed: 'Dashboard could not be loaded.',
                invite_created: 'Invite created.',
                invite_create_failed: 'Invite could not be created.',
                invite_copied: 'Invite link copied.',
                avatar_type_error: 'Avatar must be a PNG, JPEG, or WebP image.',
                avatar_size_error: 'Avatar image must be 256 KB or smaller.',
                profile_saved: 'Profile saved.',
                profile_save_failed: 'Profile could not be saved.',
                password_mismatch: 'New password and confirmation do not match.',
                password_updated: 'Password updated. Other active sessions were closed.',
                password_update_failed: 'Password could not be updated.',
                download_started: 'Download started.',
                download_failed: 'Download failed.',
                user_updated: 'User updated.',
                user_update_failed: 'User could not be updated.',
                invite_revoked: 'Invite revoked.',
                invite_revoke_failed: 'Invite could not be revoked.',
            },
        },
        vi: {
            page_title: 'Operartis | Bảng điều khiển thành viên',
            nav: {
                member_dashboard: 'Bảng điều khiển thành viên',
                admin_dashboard: 'Bảng điều khiển quản trị',
                configuration: 'Cấu hình',
                overview: 'Tổng quan',
                modules: 'Mô-đun',
                activity: 'Hoạt động',
                reports: 'Báo cáo',
                profile: 'Hồ sơ',
                security: 'Bảo mật',
                settings: 'Cài đặt',
                users: 'Người dùng',
                invites: 'Lời mời',
                all_jobs: 'Tất cả tác vụ',
                audit_log: 'Nhật ký kiểm toán',
                dashboard: 'Bảng điều khiển',
            },
            chrome: {
                welcome: 'Chào mừng, {name}',
                member: 'Thành viên',
                signed_in: 'Đã đăng nhập',
                back_to_operartis: 'Về Operartis',
                logout: 'Đăng xuất',
                open_menu: 'Mở menu bảng điều khiển',
                close_menu: 'Đóng menu bảng điều khiển',
                collapse_sidebar: 'Thu gọn thanh bên',
                expand_sidebar: 'Mở rộng thanh bên',
                footer_title: 'Operartis Analytics',
                footer_slogan: 'Optimizing Today, Growing Tomorrow',
            },
            access: {
                subtitle: 'Bảng điều khiển',
                title: 'Đăng nhập để tiếp tục',
                body: 'Đăng nhập bằng tài khoản được mời để quản lý hồ sơ, mở mô-đun, xem báo cáo được lưu và đổi mật khẩu.',
                sign_in: 'Đăng nhập',
                back_to_site: 'Về trang chủ',
            },
            sections: {
                overview: {
                    title: 'Tổng quan',
                    subtitle: 'Không gian tối ưu hóa của bạn.',
                    eyebrow: 'Không gian thành viên',
                    h1: 'Bảng điều khiển của bạn',
                    sub: 'Theo dõi hoạt động tối ưu hóa, quản lý tài khoản và mở lại các mô-đun thường dùng từ một nơi.',
                    retention: 'Lưu giữ: {days} ngày',
                    module_shortcuts: 'Lối tắt mô-đun',
                    module_shortcuts_sub: 'Cách nhanh nhất đến các công cụ tối ưu hóa.',
                    all_modules: 'Tất cả mô-đun',
                    profile_completion: 'Hoàn thiện hồ sơ',
                    profile_completion_sub: 'Dữ liệu hồ sơ đầy đủ hỗ trợ quy trình nhóm và công ty trong tương lai.',
                    edit: 'Chỉnh sửa',
                    recent_runs: 'Lần chạy mô-đun gần đây',
                    recent_runs_sub: 'Công việc mới nhất liên kết với tài khoản thành viên của bạn.',
                    view_activity: 'Xem hoạt động',
                },
                modules: {
                    title: 'Mô-đun',
                    subtitle: 'Mở các công cụ khả dụng cho tài khoản của bạn.',
                    eyebrow: 'Mô-đun tối ưu hóa',
                    h1: 'Lối tắt mô-đun',
                    sub: 'Mở các mô-đun vận hành khả dụng cho tài khoản của bạn.',
                },
                activity: {
                    title: 'Hoạt động',
                    subtitle: 'Xem lịch sử chạy mô-đun và tải lên.',
                    eyebrow: 'Lịch sử chạy',
                    h1: 'Hoạt động',
                    sub: 'Xem lại tải lên, trạng thái xử lý và hoạt động mô-đun được lưu.',
                },
                reports: {
                    title: 'Báo cáo',
                    subtitle: 'Tải đầu ra được lưu trước khi dọn dẹp.',
                    eyebrow: 'Đầu ra được lưu',
                    h1: 'Báo cáo',
                    sub: 'Tải đầu ra được lưu trước khi kết thúc cửa sổ dọn dẹp tự động.',
                    available_downloads: 'Tải xuống khả dụng',
                    available_downloads_sub: 'Báo cáo và tệp đính kèm còn khả dụng.',
                    run_status: 'Trạng thái chạy',
                    run_status_sub: 'Phân bổ lịch sử tác vụ hiện tại của bạn.',
                },
                profile: {
                    title: 'Hồ sơ',
                    subtitle: 'Quản lý thông tin thành viên.',
                    eyebrow: 'Chi tiết tài khoản',
                    h1: 'Hồ sơ',
                    sub: 'Cập nhật hồ sơ thành viên và ảnh đại diện.',
                },
                security: {
                    title: 'Bảo mật',
                    subtitle: 'Cập nhật mật khẩu và quyền truy cập.',
                    eyebrow: 'Bảo vệ tài khoản',
                    h1: 'Bảo mật',
                    sub: 'Đổi mật khẩu và giữ tài khoản thành viên được bảo vệ.',
                    change_password: 'Đổi mật khẩu',
                    change_password_sub: 'Sau khi lưu, các phiên hoạt động khác của tài khoản này sẽ bị đóng.',
                    current_password: 'Mật khẩu hiện tại',
                    new_password: 'Mật khẩu mới',
                    confirm_password: 'Xác nhận mật khẩu mới',
                    update_password: 'Cập nhật mật khẩu',
                    account_access: 'Quyền truy cập tài khoản',
                    account_access_sub: 'Những gì tài khoản thành viên này hiện có thể truy cập.',
                },
                settings: {
                    title: 'Cài đặt',
                    subtitle: 'Tùy chọn giao diện và ngôn ngữ.',
                    eyebrow: 'Tùy chọn',
                    h1: 'Cài đặt',
                    sub: 'Giao diện và ngôn ngữ được đồng bộ với trang chủ Operartis và các mô-đun tối ưu hóa.',
                    theme_mode: 'Giao diện',
                    theme_mode_sub: 'Đồng bộ với index, forecaster, ML forecaster, inventory và ABC-XYZ.',
                    language: 'Ngôn ngữ',
                    language_sub: 'Áp dụng cho các trang và mô-đun Operartis có bản dịch.',
                    theme_aria: 'Chế độ giao diện',
                    language_aria: 'Ngôn ngữ',
                },
                'admin-overview': {
                    title: 'Tổng quan',
                    subtitle: 'Quản lý hoạt động cấp tổ chức.',
                    eyebrow: 'Kiểm soát tổ chức',
                    h1: 'Tổng quan',
                    sub: 'Quản lý người dùng, lời mời, tác vụ và sự kiện kiểm toán từ cùng một không gian.',
                },
                'admin-users': {
                    title: 'Người dùng',
                    subtitle: 'Quản lý vai trò và trạng thái tài khoản.',
                    eyebrow: 'Quản lý người dùng',
                    h1: 'Người dùng',
                    sub: 'Thay đổi vai trò và tạm ngưng hoặc kích hoạt lại tài khoản. Mật khẩu không bao giờ được hiển thị.',
                },
                'admin-invites': {
                    title: 'Lời mời',
                    subtitle: 'Tạo và thu hồi lời mời tài khoản.',
                    eyebrow: 'Kiểm soát truy cập',
                    h1: 'Lời mời',
                    sub: 'Tạo liên kết mời và thu hồi lời mời đang chờ trước khi được chấp nhận.',
                },
                'admin-jobs': {
                    title: 'Tất cả tác vụ',
                    subtitle: 'Giám sát các lần chạy mô-đun của tổ chức.',
                    eyebrow: 'Hoạt động tổ chức',
                    h1: 'Tất cả tác vụ',
                    sub: 'Xem lại các lần chạy mô-đun trên toàn tổ chức.',
                },
                'admin-audit': {
                    title: 'Nhật ký kiểm toán',
                    subtitle: 'Xem các sự kiện bảo mật và quản trị gần đây.',
                    eyebrow: 'Dấu vết bảo mật',
                    h1: 'Nhật ký kiểm toán',
                    sub: 'Các sự kiện quản trị và bảo mật gần đây của tổ chức.',
                },
            },
            theme: { light: 'Sáng', dark: 'Tối', system: 'Hệ thống' },
            lang_labels: {
                en_sub: 'Tiếng Anh Mỹ',
                vi_sub: 'Tiếng Việt',
                de_sub: 'Tiếng Đức',
            },
            metrics: {
                runs: 'Lần chạy',
                runs_note: '{count} hoàn thành',
                active: 'Đang hoạt động',
                active_note: 'Đang chờ hoặc xử lý',
                downloads: 'Tải xuống',
                downloads_note: 'Khả dụng ngay',
                profile: 'Hồ sơ',
                profile_note: 'Thông tin thành viên',
            },
            actions: { open: 'Mở', open_module: 'Mở mô-đun', available: 'khả dụng', download: 'Tải xuống' },
            messages: {
                lang_saved: 'Đã lưu tùy chọn ngôn ngữ.',
                request_failed: 'Yêu cầu thất bại.',
                dashboard_load_failed: 'Không thể tải bảng điều khiển.',
                invite_created: 'Đã tạo lời mời.',
                invite_create_failed: 'Không thể tạo lời mời.',
                invite_copied: 'Đã sao chép liên kết mời.',
                avatar_type_error: 'Ảnh đại diện phải là PNG, JPEG hoặc WebP.',
                avatar_size_error: 'Ảnh đại diện phải nhỏ hơn hoặc bằng 256 KB.',
                profile_saved: 'Đã lưu hồ sơ.',
                profile_save_failed: 'Không thể lưu hồ sơ.',
                password_mismatch: 'Mật khẩu mới và xác nhận không khớp.',
                password_updated: 'Đã cập nhật mật khẩu. Các phiên hoạt động khác đã bị đóng.',
                password_update_failed: 'Không thể cập nhật mật khẩu.',
                download_started: 'Đã bắt đầu tải xuống.',
                download_failed: 'Tải xuống thất bại.',
                user_updated: 'Đã cập nhật người dùng.',
                user_update_failed: 'Không thể cập nhật người dùng.',
                invite_revoked: 'Đã thu hồi lời mời.',
                invite_revoke_failed: 'Không thể thu hồi lời mời.',
            },
        },
        de: {
            page_title: 'Operartis | Mitglieder-Dashboard',
            nav: {
                member_dashboard: 'Mitglieder-Dashboard',
                admin_dashboard: 'Admin-Dashboard',
                configuration: 'Konfiguration',
                overview: 'Übersicht',
                modules: 'Module',
                activity: 'Aktivität',
                reports: 'Berichte',
                profile: 'Profil',
                security: 'Sicherheit',
                settings: 'Einstellungen',
                users: 'Benutzer',
                invites: 'Einladungen',
                all_jobs: 'Alle Jobs',
                audit_log: 'Audit-Protokoll',
                dashboard: 'Dashboard',
            },
            chrome: {
                welcome: 'Willkommen, {name}',
                member: 'Mitglied',
                signed_in: 'Angemeldet',
                back_to_operartis: 'Zurück zu Operartis',
                logout: 'Abmelden',
                open_menu: 'Dashboard-Menü öffnen',
                close_menu: 'Dashboard-Menü schließen',
                collapse_sidebar: 'Seitenleiste einklappen',
                expand_sidebar: 'Seitenleiste ausklappen',
                footer_title: 'Operartis Analytics',
                footer_slogan: 'Optimizing Today, Growing Tomorrow',
            },
            access: {
                subtitle: 'Dashboard',
                title: 'Anmelden, um fortzufahren',
                body: 'Melden Sie sich mit Ihrem eingeladenen Konto an, um Ihr Profil zu verwalten, Module zu öffnen, gespeicherte Berichte anzusehen und Ihr Passwort zu ändern.',
                sign_in: 'Anmelden',
                back_to_site: 'Zurück zur Website',
            },
            sections: {
                overview: {
                    title: 'Übersicht',
                    subtitle: 'Ihr Optimierungs-Arbeitsbereich.',
                    eyebrow: 'Mitglieder-Arbeitsbereich',
                    h1: 'Ihr Dashboard',
                    sub: 'Verfolgen Sie Optimierungsaktivitäten, verwalten Sie Ihr Konto und öffnen Sie häufig genutzte Module an einem Ort.',
                    retention: 'Aufbewahrung: {days} Tage',
                    module_shortcuts: 'Modul-Verknüpfungen',
                    module_shortcuts_sub: 'Der schnellste Weg zu Ihren Optimierungstools.',
                    all_modules: 'Alle Module',
                    profile_completion: 'Profilvollständigkeit',
                    profile_completion_sub: 'Vollständige Profildaten unterstützen zukünftige Team- und Unternehmens-Workflows.',
                    edit: 'Bearbeiten',
                    recent_runs: 'Letzte Modul-Läufe',
                    recent_runs_sub: 'Neueste Arbeiten, die mit Ihrem Mitgliedskonto verknüpft sind.',
                    view_activity: 'Aktivität anzeigen',
                },
                modules: {
                    title: 'Module',
                    subtitle: 'Öffnen Sie die für Ihr Konto verfügbaren Tools.',
                    eyebrow: 'Optimierungsmodule',
                    h1: 'Modul-Verknüpfungen',
                    sub: 'Öffnen Sie die für Ihr Konto verfügbaren operativen Module.',
                },
                activity: {
                    title: 'Aktivität',
                    subtitle: 'Modul-Läufe und Upload-Verlauf prüfen.',
                    eyebrow: 'Laufverlauf',
                    h1: 'Aktivität',
                    sub: 'Uploads, Verarbeitungsstatus und gespeicherte Modulaktivität prüfen.',
                },
                reports: {
                    title: 'Berichte',
                    subtitle: 'Gespeicherte Ausgaben vor der Bereinigung herunterladen.',
                    eyebrow: 'Gespeicherte Ausgaben',
                    h1: 'Berichte',
                    sub: 'Laden Sie gespeicherte Ausgaben herunter, bevor das automatische Bereinigungsfenster endet.',
                    available_downloads: 'Verfügbare Downloads',
                    available_downloads_sub: 'Berichte und Artefakte, die noch verfügbar sind.',
                    run_status: 'Laufstatus',
                    run_status_sub: 'Verteilung Ihres aktuellen Job-Verlaufs.',
                },
                profile: {
                    title: 'Profil',
                    subtitle: 'Mitgliederinformationen verwalten.',
                    eyebrow: 'Kontodetails',
                    h1: 'Profil',
                    sub: 'Aktualisieren Sie Ihr Mitgliederprofil und Avatar.',
                },
                security: {
                    title: 'Sicherheit',
                    subtitle: 'Passwort und Kontozugriff aktualisieren.',
                    eyebrow: 'Kontoschutz',
                    h1: 'Sicherheit',
                    sub: 'Ändern Sie Ihr Passwort und schützen Sie Ihr Mitgliedskonto.',
                    change_password: 'Passwort ändern',
                    change_password_sub: 'Nach dem Speichern werden andere aktive Sitzungen dieses Kontos geschlossen.',
                    current_password: 'Aktuelles Passwort',
                    new_password: 'Neues Passwort',
                    confirm_password: 'Neues Passwort bestätigen',
                    update_password: 'Passwort aktualisieren',
                    account_access: 'Kontozugriff',
                    account_access_sub: 'Was dieses Mitgliedskonto derzeit zugreifen kann.',
                },
                settings: {
                    title: 'Einstellungen',
                    subtitle: 'Design- und Spracheinstellungen.',
                    eyebrow: 'Einstellungen',
                    h1: 'Einstellungen',
                    sub: 'Design und Sprache bleiben mit Operartis-Startseite und Optimierungsmodulen synchron.',
                    theme_mode: 'Design-Modus',
                    theme_mode_sub: 'Geteilt mit Index, Forecaster, ML Forecaster, Inventory und ABC-XYZ.',
                    language: 'Sprache',
                    language_sub: 'Gilt für übersetzte Operartis-Seiten und Module.',
                    theme_aria: 'Design-Modus',
                    language_aria: 'Sprache',
                },
                'admin-overview': {
                    title: 'Übersicht',
                    subtitle: 'Organisationsaktivität verwalten.',
                    eyebrow: 'Organisationssteuerung',
                    h1: 'Übersicht',
                    sub: 'Benutzer, Einladungen, Jobs und Audit-Ereignisse vom selben Arbeitsbereich aus verwalten.',
                },
                'admin-users': {
                    title: 'Benutzer',
                    subtitle: 'Rollen und Kontostatus verwalten.',
                    eyebrow: 'Benutzerverwaltung',
                    h1: 'Benutzer',
                    sub: 'Rollen ändern und Konten sperren oder reaktivieren. Passwörter werden nie angezeigt.',
                },
                'admin-invites': {
                    title: 'Einladungen',
                    subtitle: 'Kontoeinladungen erstellen und widerrufen.',
                    eyebrow: 'Zugriffskontrolle',
                    h1: 'Einladungen',
                    sub: 'Einladungslinks erstellen und ausstehende Einladungen vor Annahme widerrufen.',
                },
                'admin-jobs': {
                    title: 'Alle Jobs',
                    subtitle: 'Organisations-Modul-Läufe überwachen.',
                    eyebrow: 'Organisationsaktivität',
                    h1: 'Alle Jobs',
                    sub: 'Modul-Läufe in der gesamten Organisation prüfen.',
                },
                'admin-audit': {
                    title: 'Audit-Protokoll',
                    subtitle: 'Aktuelle Sicherheits- und Admin-Ereignisse prüfen.',
                    eyebrow: 'Sicherheitsprotokoll',
                    h1: 'Audit-Protokoll',
                    sub: 'Aktuelle Admin- und Sicherheitsereignisse der Organisation.',
                },
            },
            theme: { light: 'Hell', dark: 'Dunkel', system: 'System' },
            lang_labels: {
                en_sub: 'US-Englisch',
                vi_sub: 'Vietnamesisch',
                de_sub: 'Deutsch',
            },
            metrics: {
                runs: 'Läufe',
                runs_note: '{count} abgeschlossen',
                active: 'Aktiv',
                active_note: 'In Warteschlange oder in Verarbeitung',
                downloads: 'Downloads',
                downloads_note: 'Jetzt verfügbar',
                profile: 'Profil',
                profile_note: 'Mitgliederinformationen',
            },
            actions: { open: 'Öffnen', open_module: 'Modul öffnen', available: 'verfügbar', download: 'Herunterladen' },
            messages: {
                lang_saved: 'Spracheinstellung gespeichert.',
                request_failed: 'Anfrage fehlgeschlagen.',
                dashboard_load_failed: 'Dashboard konnte nicht geladen werden.',
                invite_created: 'Einladung erstellt.',
                invite_create_failed: 'Einladung konnte nicht erstellt werden.',
                invite_copied: 'Einladungslink kopiert.',
                avatar_type_error: 'Avatar muss PNG, JPEG oder WebP sein.',
                avatar_size_error: 'Avatar-Bild muss 256 KB oder kleiner sein.',
                profile_saved: 'Profil gespeichert.',
                profile_save_failed: 'Profil konnte nicht gespeichert werden.',
                password_mismatch: 'Neues Passwort und Bestätigung stimmen nicht überein.',
                password_updated: 'Passwort aktualisiert. Andere aktive Sitzungen wurden geschlossen.',
                password_update_failed: 'Passwort konnte nicht aktualisiert werden.',
                download_started: 'Download gestartet.',
                download_failed: 'Download fehlgeschlagen.',
                user_updated: 'Benutzer aktualisiert.',
                user_update_failed: 'Benutzer konnte nicht aktualisiert werden.',
                invite_revoked: 'Einladung widerrufen.',
                invite_revoke_failed: 'Einladung konnte nicht widerrufen werden.',
            },
        },
    };

    const NAV_SECTION_KEYS = {
        overview: 'nav.overview',
        modules: 'nav.modules',
        activity: 'nav.activity',
        reports: 'nav.reports',
        profile: 'nav.profile',
        security: 'nav.security',
        settings: 'nav.settings',
        'admin-overview': 'nav.overview',
        'admin-users': 'nav.users',
        'admin-invites': 'nav.invites',
        'admin-jobs': 'nav.all_jobs',
        'admin-audit': 'nav.audit_log',
    };

    function currentLang() {
        return window.getOperartisLang ? window.getOperartisLang() : 'en';
    }

    function resolve(lang, key) {
        const parts = String(key).split('.');
        let value = TRANSLATIONS[lang] || TRANSLATIONS.en;
        let fallback = TRANSLATIONS.en;
        for (let i = 0; i < parts.length; i += 1) {
            value = value && value[parts[i]];
            fallback = fallback && fallback[parts[i]];
        }
        return value != null ? value : (fallback != null ? fallback : key);
    }

    function t(key, vars) {
        let out = resolve(currentLang(), key);
        if (vars && typeof out === 'string') {
            Object.keys(vars).forEach(function (name) {
                out = out.replace(new RegExp('\\{' + name + '\\}', 'g'), String(vars[name]));
            });
        }
        return out;
    }

    function buildSectionCopy() {
        const copy = {};
        SECTION_IDS.forEach(function (id) {
            copy[id] = [
                t('sections.' + id + '.title'),
                t('sections.' + id + '.subtitle'),
            ];
        });
        return copy;
    }

    function applySectionHeroes() {
        SECTION_IDS.forEach(function (id) {
            const section = document.getElementById('section-' + id);
            if (!section) return;
            const prefix = 'sections.' + id + '.';
            const eyebrow = section.querySelector('.hero-eyebrow');
            const title = section.querySelector('.hero h1');
            const sub = section.querySelector('.hero .sub');
            if (eyebrow) eyebrow.textContent = t(prefix + 'eyebrow');
            if (title && title.id !== 'welcome-title') title.textContent = t(prefix + 'h1');
            if (sub) sub.textContent = t(prefix + 'sub');
        });
    }

    function applyNavLabels() {
        document.querySelectorAll('.nav-btn[data-section]').forEach(function (button) {
            const key = NAV_SECTION_KEYS[button.dataset.section];
            const label = button.querySelector('span:last-child');
            if (key && label) {
                label.textContent = t(key);
                button.setAttribute('title', t(key));
            }
        });
        const memberLabel = document.querySelector('.side-label.admin-only');
        const adminLabels = document.querySelectorAll('.side-label.admin-only');
        if (adminLabels[0]) adminLabels[0].textContent = t('nav.member_dashboard');
        if (adminLabels[1]) adminLabels[1].textContent = t('nav.admin_dashboard');
        const configLabel = document.querySelector('.side-label.always-visible');
        if (configLabel) configLabel.textContent = t('nav.configuration');
        const brandSubtitle = document.querySelector('.side-brand span');
        if (brandSubtitle) brandSubtitle.textContent = t('nav.dashboard');
    }

    function apply() {
        document.documentElement.lang = currentLang();
        document.title = t('page_title');
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            el.textContent = t(el.dataset.i18n);
        });
        document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
            el.setAttribute('aria-label', t(el.dataset.i18nAria));
        });
        document.querySelectorAll('[data-theme]').forEach(function (button) {
            const label = button.querySelector('[data-i18n-theme]');
            if (label) label.textContent = t('theme.' + button.dataset.theme);
        });
        document.querySelectorAll('[data-lang] [data-i18n-lang-sub]').forEach(function (el) {
            el.textContent = t('lang_labels.' + el.dataset.i18nLangSub + '_sub');
        });
        const themeGroup = document.getElementById('theme-options');
        if (themeGroup) themeGroup.setAttribute('aria-label', t('sections.settings.theme_aria'));
        const langGroup = document.getElementById('lang-options');
        if (langGroup) langGroup.setAttribute('aria-label', t('sections.settings.language_aria'));
        applyNavLabels();
        applySectionHeroes();
    }

    window.OperartisDashboardI18n = {
        t: t,
        apply: apply,
        buildSectionCopy: buildSectionCopy,
    };
})();
