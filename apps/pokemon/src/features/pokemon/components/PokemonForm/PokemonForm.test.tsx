import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
const createPokemon = vi.fn();

vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/features/pokemon/data/actions/create-pokemon", () => ({ createPokemon }));

const { PokemonForm } = await import("./index");

const values = {
  name: "sparkymon",
  types: ["electric"],
  abilities: "",
  stats: { hp: "50", attack: "50", defense: "50", "special-attack": "50", "special-defense": "50", speed: "50" },
};

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

function submit() {
  render(<PokemonForm types={["electric", "water"]} />);
  fireEvent.click(screen.getByRole("button", { name: "Add pokemon" }));
}

describe("PokemonForm", () => {
  it("shows field errors and keeps what the user typed", async () => {
    createPokemon.mockResolvedValue({ errors: { abilities: "Add at least one ability." }, values });
    submit();

    expect(await screen.findByText("Add at least one ability.")).toBeTruthy();
    expect(screen.getByRole<HTMLInputElement>("textbox", { name: "Name" }).value).toBe("sparkymon");
    expect(screen.getByRole<HTMLInputElement>("checkbox", { name: "electric" }).checked).toBe(true);
    expect(push).not.toHaveBeenCalled();
  });

  it("shows a form-level error", async () => {
    createPokemon.mockResolvedValue({ formError: "Something went wrong while saving. Please try again.", values });
    submit();

    expect((await screen.findByRole("alert")).textContent).toBe("Something went wrong while saving. Please try again.");
  });

  it("opens the new pokemon after it is created", async () => {
    createPokemon.mockResolvedValue({ createdName: "sparkymon", values });
    submit();

    await waitFor(() => expect(push).toHaveBeenCalledWith("/sparkymon"));
  });
});
