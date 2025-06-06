import os
import shutil
import tkinter as tk
from tkinter import messagebox
from tkinter import ttk
import subprocess
from datetime import datetime

LOG_FILE = "cleaner_log.txt"

# Логгирование
def log(message):
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {message}\n")

# Подсчёт размера директории
def get_dir_size(path):
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(path):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            try:
                if os.path.isfile(fp):
                    total_size += os.path.getsize(fp)
            except Exception as e:
                log(f"Ошибка при подсчёте размера {fp}: {e}")
    return total_size

# Очистка папки
def clear_folder(path):
    size_freed = 0
    if not os.path.exists(path):
        return 0
    for filename in os.listdir(path):
        file_path = os.path.join(path, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                size_freed += os.path.getsize(file_path)
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                size_freed += get_dir_size(file_path)
                shutil.rmtree(file_path, ignore_errors=True)
        except Exception as e:
            log(f"Ошибка при удалении {file_path}: {e}")
    return size_freed

# Очистка
def perform_cleanup():
    total_freed = 0

    if temp_user_var.get():
        size = get_dir_size(temp_user)
        freed = clear_folder(temp_user)
        total_freed += freed
        log(f"%TEMP%: очищено {freed // 1024 // 1024} MB из {size // 1024 // 1024} MB")

    if temp_win_var.get():
        size = get_dir_size(temp_win)
        freed = clear_folder(temp_win)
        total_freed += freed
        log(f"Windows Temp: очищено {freed // 1024 // 1024} MB из {size // 1024 // 1024} MB")

    if prefetch_var.get():
        size = get_dir_size(prefetch)
        freed = clear_folder(prefetch)
        total_freed += freed
        log(f"Prefetch: очищено {freed // 1024 // 1024} MB из {size // 1024 // 1024} MB")

    if recycle_var.get():
        try:
            subprocess.run(["powershell", "-command", "Clear-RecycleBin -Force"], check=True)
            log("Корзина очищена")
        except Exception as e:
            log(f"Ошибка при очистке корзины: {e}")

    if update_cache_var.get():
        try:
            subprocess.run(["net", "stop", "wuauserv"], check=True)
            subprocess.run(["net", "stop", "bits"], check=True)
            size = get_dir_size(update_cache)
            freed = clear_folder(update_cache)
            total_freed += freed
            subprocess.run(["net", "start", "wuauserv"], check=True)
            subprocess.run(["net", "start", "bits"], check=True)
            log(f"Кэш обновлений: очищено {freed // 1024 // 1024} MB из {size // 1024 // 1024} MB")
        except Exception as e:
            log(f"Ошибка при очистке кэша обновлений: {e}")

    messagebox.showinfo("Очистка завершена", f"Освобождено примерно {total_freed // 1024 // 1024} MB.\nСмотри лог: {LOG_FILE}")

# Пути
temp_user = os.getenv("TEMP")
temp_win = "C:\\Windows\\Temp"
prefetch = "C:\\Windows\\Prefetch"
update_cache = "C:\\Windows\\SoftwareDistribution\\Download"

# GUI
window = tk.Tk()
window.title("Windows 11 Cleaner Pro")
window.geometry("450x400")
window.resizable(False, False)

tk.Label(window, text="Выберите, что очистить", font=("Arial", 14, "bold")).pack(pady=10)

frame = tk.Frame(window)
frame.pack(pady=5)

temp_user_var = tk.BooleanVar(value=True)
temp_win_var = tk.BooleanVar(value=True)
prefetch_var = tk.BooleanVar(value=False)
recycle_var = tk.BooleanVar(value=True)
update_cache_var = tk.BooleanVar(value=False)

ttk.Checkbutton(frame, text="Очистить временные файлы пользователя (%TEMP%)", variable=temp_user_var).pack(anchor="w")
ttk.Checkbutton(frame, text="Очистить временные файлы Windows (C:\\Windows\\Temp)", variable=temp_win_var).pack(anchor="w")
ttk.Checkbutton(frame, text="Очистить папку Prefetch", variable=prefetch_var).pack(anchor="w")
ttk.Checkbutton(frame, text="Очистить корзину", variable=recycle_var).pack(anchor="w")
ttk.Checkbutton(frame, text="Очистить кэш обновлений Windows", variable=update_cache_var).pack(anchor="w")

tk.Button(window, text="🧹 Очистить выбранное", command=perform_cleanup, bg="#2ecc71", fg="white", font=("Arial", 12), width=30).pack(pady=20)

tk.Label(window, text="Лог будет сохранён в cleaner_log.txt", font=("Arial", 10)).pack(side="bottom", pady=10)

window.mainloop()
