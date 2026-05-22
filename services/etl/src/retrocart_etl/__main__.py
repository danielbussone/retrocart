import argparse
import sys


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="retrocart-etl",
        description="RetroCart No-Intro ingestion (scaffold)",
    )
    parser.add_argument(
        "--dat-file",
        help="Path to a No-Intro dat XML file (not implemented)",
    )
    args = parser.parse_args()
    if args.dat_file:
        print(f"ETL ingest not implemented yet: {args.dat_file}", file=sys.stderr)
        sys.exit(1)
    parser.print_help()
    sys.exit(0)


if __name__ == "__main__":
    main()
