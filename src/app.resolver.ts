// hello.resolver.ts
import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String, {
    description: 'A simple hello world query',
  })
  hello() {
    return 'Hello, world!';
  }
}
