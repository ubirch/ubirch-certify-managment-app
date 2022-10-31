export enum PocType {
    ub_vac_app = 'ub_vac_app',
    ub_test_app = 'ub_test_app',
    ub_test_api = 'ub_test_api',
    bmg_vac_app = 'bmg_vac_app',
    bmg_vac_rec_app = 'bmg_vac_rec_app',
    bmg_vac_api = 'bmg_vac_api',
    bmg_vac_rec_api = 'bmg_vac_rec_api',
    bmg_test_api = 'bmg_test_api',
    ub_can_api = 'ub_can_api',
}

export const PocTypeTranslation: Record<PocType, string> = {
    [PocType.ub_vac_app]: 'ub_vac_app',
    [PocType.ub_test_app]: 'ub_test_app',
    [PocType.ub_test_api]: 'ub_test_api',
    [PocType.bmg_vac_app]: 'bmg_vac_app',
    [PocType.bmg_vac_rec_app]: 'bmg_vac_rec_app',
    [PocType.bmg_vac_api]: 'bmg_vac_api',
    [PocType.bmg_vac_rec_api]: 'bmg_vac_rec_api',
    [PocType.bmg_test_api]: 'bmg_test_api',
    [PocType.ub_can_api]: 'ub_can_api'
};
