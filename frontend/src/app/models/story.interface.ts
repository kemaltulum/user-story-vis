import { Object } from './object.interface';

export interface Story extends Object {
    full_text: string;
    is_parsed?: boolean;
    id_user: string;
    actor?: string;
    goal?: string;
    reason?: string;
    project_id?: string;
    error_status?: {
        errors?: Array<{
            error_type?: string;
            error_place?: string;
            message: string;
        }>
    };
}
