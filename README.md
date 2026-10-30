# ET Bilu

Endless runner with a neural-network agent. The network lives in a separate library ([NeuralNetworkJS](../NeuralNetworkJS)); this game only consumes `predict` / `clone` / `mutate`.

## Run with Docker

No local npm. The image copies `NeuralNetworkJS/src/neural-network.js` into `vendor/` at build time.

```bash
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080).

## Controls

- ENTER — start
- UP / SPACE — jump (play alone)
- DOWN — duck (play alone)
- Menu: play alone, see AI (50 agents, one generation after another)

## AI mode

Each generation keeps the two fittest genomes intact and mutates the rest. The agent sees the nearest obstacle ahead (distance, size, altitude, speed, airborne) and chooses idle, jump, or duck.
