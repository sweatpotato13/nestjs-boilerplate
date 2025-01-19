import { ElasticsearchModule } from "./elasticsearch/elasticsearch.module";
import { JwtModule } from "./jwt/jwt.module";
import { KafkaModule } from "./kafka/kafka.module";
import { MailerModule } from "./mailer/mailer.module";
import { PassportModule } from "./passport/passport.module";
import { RedisModule } from "./redis/redis.module";

export {
    ElasticsearchModule,
    JwtModule,
    KafkaModule,
    MailerModule,
    PassportModule,
    RedisModule
};
