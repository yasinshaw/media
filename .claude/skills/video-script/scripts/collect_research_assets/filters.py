from __future__ import annotations

from urllib.parse import urlparse


SKIP_EXTENSIONS = frozenset({".svg", ".gif"})

SKIP_PATH_FRAGMENTS = (
    "/icon",
    "/logo",
    "/avatar",
    "/sprite",
    "/emoji",
    "/pixel",
    "/tracking",
    "/ad/",
    "/ads/",
    "/spinner",
)

DEFAULT_DOMAIN_CAP = 5
DEFAULT_MIN_IMAGE_DIM = 400


def is_acceptable_url(url: str) -> bool:
    """Return True if the URL is worth downloading as a research asset."""
    if not url or url.startswith("data:"):
        return False

    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https"):
        return False

    path = parsed.path.lower()
    if any(path.endswith(ext) for ext in SKIP_EXTENSIONS):
        return False
    if any(frag in path for frag in SKIP_PATH_FRAGMENTS):
        return False

    return True


def normalize_host(url: str) -> str:
    """Extract the hostname from a URL, stripping 'www.' prefix."""
    host = urlparse(url).netloc.lower()
    if host.startswith("www."):
        host = host[4:]
    return host


def exceeds_domain_quota(
    host: str, counts: dict[str, int], cap: int = DEFAULT_DOMAIN_CAP
) -> bool:
    """Return True if the host has already reached the per-domain image cap."""
    return counts.get(host, 0) >= cap


def is_acceptable_image_size(
    width: int, height: int, min_dim: int = DEFAULT_MIN_IMAGE_DIM
) -> bool:
    """Return True if both dimensions meet the minimum requirement."""
    return width >= min_dim and height >= min_dim
