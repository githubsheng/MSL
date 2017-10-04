package DLS.CommandGenerator.commands.flow;

import DLS.CommandGenerator.AbstractCommand;
import DLS.CommandGenerator.Command;

public class CGoTo extends AbstractCommand {

    private Command goToCommand;

    @Override
    public String getName() {
        return "go_to";
    }

    public Command getGoToCommand() {
        return goToCommand;
    }

    public void setGoToCommand(Command goToCommand) {
        this.goToCommand = goToCommand;
    }
}
