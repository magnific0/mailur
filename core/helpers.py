import hashlib
import os
import time
import signal
from contextlib import ContextDecorator, contextmanager

from . import log


@contextmanager
def with_lock(target, timeout=10, force=False):
    path = '/tmp/%s' % (hashlib.md5(target.encode()).hexdigest())

    def is_locked():
        if not os.path.exists(path):
            return

        with open(path) as f:
            pid = f.read()

        # Check if process exists
        try:
            os.kill(int(pid), 0)
        except (OSError, ValueError):
            os.remove(path)
            return

        minutes_out = (time.time() - os.path.getctime(path)) / 60
        if minutes_out > timeout or force:
            try:
                os.kill(int(pid), signal.SIGQUIT)
                os.remove(path)
            except:
                pass
            return
        log.warn(
            '%r is locked (for %.2f minutes). Remove file %r to run',
            target, minutes_out, path
        )
        raise SystemExit()

    is_locked()
    try:
        with open(path, 'w') as f:
            f.write(str(os.getpid()))
        yield
    finally:
        os.remove(path)


class Timer(ContextDecorator):
    __slots__ = ('start', 'finish', 'label')

    def __init__(self, label=None):
        self.reset()
        self.label = label

    def __enter__(self):
        self.reset()

    def __exit__(self, *a, **kw):
        duration = self.duration
        if self.label:
            log.info('%s for %.2fs', self.label, duration)

    def reset(self):
        self.start = time.time()

    @property
    def duration(self):
        self.finish = time.time()
        return self.finish - self.start

    def time(self, reset=True):
        duration = self.duration
        if reset:
            self.reset()
        return duration
