#!/usr/bin/env python


def signal_handler(signal, frame):
    import sys
    print('Byebye.')
    sys.exit(0)


def main(args):
    import signal
    from World import World
    from Simulation import Simulation

    signal.signal(signal.SIGINT, signal_handler)
    world = World()
    world.setup(args.grid_size, args.num_agents)
    simulation = Simulation(world)
    simulation.run()


def get_args():
    import argparse

    parser = argparse.ArgumentParser(description='Run traffic simulation', add_help=True, formatter_class=argparse.ArgumentDefaultsHelpFormatter)

    parser.add_argument('-g', '--grid-size', type=int, help="Grid size determines the number of junctions in each dimension", default=45)
    parser.add_argument('-a', '--num-agents', type=int, help="Number of agents", default=100)

    args = parser.parse_args()

    return(args)

if __name__ == '__main__':
    args = get_args()
    main(args)
