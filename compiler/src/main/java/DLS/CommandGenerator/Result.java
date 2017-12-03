package DLS.CommandGenerator;

import java.util.List;

/**
 * Created by wangsheng on 9/10/17.
 */
public class Result {

    public final List<String> stringConstants;
    public final List<String> commands;
    public final List<String> pluginImports;

    public Result(List<String> strings, List<String> commands, List<String> pluginImports) {
        this.stringConstants = strings;
        this.commands = commands;
        this.pluginImports = pluginImports;
    }
}
