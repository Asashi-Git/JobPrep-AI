# Git Command Reference Guide

A categorized dictionary of commands for the JobPrep-AI team.

---

## 1. Inspection & Awareness

*Use these commands to answer: "Where am I and what is happening?"*

| Command                 | What it does                                            | When to use it                                              |
| :---------------------- | :------------------------------------------------------ | :---------------------------------------------------------- |
| **`git status`**        | Shows modified files, staged files, and current branch. | **Constantly.** Use this before every add, commit, or push. |
| **`git log --oneline`** | Shows a compact list of previous commits (history).     | When you want to see what your team has done recently.      |
| **`git diff`**          | Shows the specific lines of code you changed.           | Before `git add`, to double-check you didn't leave a typo.  |

---

## 2. Synchronization (Talking to GitHub)

*Use these to keep your computer in sync with the team.*

| Command                           | What it does                                               | When to use it                                                          |
| :-------------------------------- | :--------------------------------------------------------- | :---------------------------------------------------------------------- |
| **`git pull origin main`**        | Downloads updates from GitHub and merges them.             | **First thing in the morning** or before starting a new feature.        |
| **`git fetch`**                   | Downloads updates but **does not** merge them (safe mode). | When you just want to see if changes exist without touching your files. |
| **`git push -u origin <branch>`** | Uploads your specific branch to GitHub.                    | When you have committed code and want to back it up or share it.        |

---

## 3. Branching (The Multiverse)

*Use these to manage your parallel workspaces.*

| Command | What it does | When to use it |
| :--- | :--- | :--- |
| **`git branch`** | Lists all local branches on your machine. | When you forgot which branches you have created. |
| **`git checkout -b <name>`** | Creates a **new** branch and switches to it immediately. | When starting a new task (e.g., `git checkout -b feature/login`). |
| **`git checkout <name>`** | Switches to an **existing** branch. | When swapping between tasks (e.g., going back to `main`). |
| **`git branch -d <name>`** | Deletes a branch. | When a feature is finished and merged, and you want to clean up. |

---

## 4. Saving Work (The 2-Step Process)

*Use these to record your progress.*

| Command | What it does | When to use it |
| :--- | :--- | :--- |
| **`git add .`** | Moves **all** modified files to the "Staging Area". | When you are happy with your edits and ready to prepare them. |
| **`git add <file>`** | Moves **only one** specific file to the "Staging Area". | When you edited 5 files but only want to save 1 of them. |
| **`git commit -m "msg"`** | Takes a snapshot of the "Staging Area" and saves it to history. | Immediately after `git add`. **This creates the save point.** |

---

## 5. Emergency & Undo (The Panic Button)

*Use these when things go wrong.*

| Command                | What it does                                           | When to use it                                                                    |
| :--------------------- | :----------------------------------------------------- | :-------------------------------------------------------------------------------- |
| **`git checkout .`**   | **DANGER:** Discards all local changes to files.       | When you messed up your code and just want to reset files to the last commit.     |
| **`git reset HEAD~1`** | Undoes the last `commit`, but keeps your file changes. | When you committed too early and want to "un-commit" to fix a typo.               |
| **`git stash`**        | Temporarily hides your changes in a pocket.            | When you need to pull updates but aren't ready to commit your current messy work. |
| **`git stash pop`**    | Brings back the hidden changes.                        | After you have pulled updates and are ready to resume working.                    |

git config --global alias.tree "log --graph --oneline --all --decorate"
git tree

Nuclear Option:
git push --force origin main

Hello word !

git remote set-url origin [git@github.com](mailto:git@github.com):Asashi-Git/JobPrep-AI.git

git remote -v

git config --global user.email "email" 
git config --global user.name "Username"

git rm -r --cached secrets/