import argparse
import asyncio
from pathlib import Path
from dotenv import load_dotenv
from .orchestrator import run

PROJECT_ROOT = Path(__file__).resolve().parents[5]


def main() -> None:
    load_dotenv(PROJECT_ROOT / ".env")
    parser = argparse.ArgumentParser(prog="collect-research-assets")
    parser.add_argument("--slug", required=True)
    parser.add_argument("--research-md", required=True, type=Path)
    parser.add_argument("--tavily-results-json", required=True, type=Path)
    parser.add_argument("--refresh", action="store_true")
    args = parser.parse_args()

    project_dir = next(
        (d for d in (PROJECT_ROOT / "projects").iterdir() if args.slug in d.name),
        None,
    )
    if not project_dir:
        raise SystemExit(f"project not found for slug: {args.slug}")

    asyncio.run(run(project_dir, args.research_md, args.tavily_results_json, args.refresh))


if __name__ == "__main__":
    main()
