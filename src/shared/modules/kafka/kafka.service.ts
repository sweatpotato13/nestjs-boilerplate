import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

@Injectable()
export class KafkaService {
    constructor(@Inject("KAFKA") private readonly kafkaProducer: ClientKafka) {
        void this.kafkaProducer.connect();
    }

    public sendMessage(topic: string, message: string): void {
        this.kafkaProducer.emit(topic, message);
    }
}
