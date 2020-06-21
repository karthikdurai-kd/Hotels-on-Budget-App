export class bookingStructure{
    constructor(
        public id:string,
        public placeId: string,
        public userId: string,
        public placeTitle: string,
        public placeImage: string,
        public firstName: string,
        public lastname: string,
        public guestNumber: number,
        public dateFrom: Date,
        public dateTo: Date
    ){}
}