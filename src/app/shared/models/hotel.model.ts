export class Hotel {
    info: {
        addr: string;
        cat: number;
        catid: string;
        catname: string;
        id: string;
        img: string;
        imgnum: number;
        isdesc: boolean;
        name: string;
        point: number[];
        site: {
            label: string;
            url: string;
        }
    };
    items: {
        commerce: {
            currency: number;
            discount: number;
            offer: string;
            original: number;
            payment: number;
            providerid: string;
            reservationfee: number;
            tl: number;
            tltime: number;
            toriginal: number;
            tpayment: number;
        }
        meal: string;
        type: string;
    }[][];
}
